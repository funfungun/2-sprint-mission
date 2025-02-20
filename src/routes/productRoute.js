import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Error handling utility function
const asyncHandler = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (e) {
      console.error(e);
      if (e.code === "P2025") {
        res.status(404).send({ message: "Product not found" });
      } else {
        res.status(500).send({ message: "Internal server error" });
      }
    }
  };
};

// 상품 목록 조회 API
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { offset = 0, limit = 10, order = "recent", search = "" } = req.query;
    let orderBy = { createdAt: "desc" }; // 기본값: 최신순 정렬

    if (order === "oldest") {
      orderBy = { createdAt: "asc" };
    }

    // 모든 필드를 반환 (select 제거)
    const products = await prisma.product.findMany({
      skip: parseInt(offset), // 페이지네이션 offset
      take: parseInt(limit), // 페이지네이션 limit
      orderBy, // 정렬 기준
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } }, // 이름 검색
          { description: { contains: search, mode: "insensitive" } }, // 설명 검색
        ],
      },
    });

    res.status(200).send(products); // 모든 필드를 반환
  })
);

// 상품 등록 API
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, description, price, tags } = req.body;

    // 필수 필드 유효성 검사
    if (!name || !description || !price || !Array.isArray(tags)) {
      return res.status(400).send({ message: "Invalid input data" });
    }

    // 상품 생성
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price), // price가 숫자인지 확인
        tags,
      },
    });

    // 생성된 상품 반환
    res.status(201).send(newProduct);
  })
);

// 상품 상세 조회 API
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // 상품 조회
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
      },
    });

    // 상품이 없는 경우 처리
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // 조회된 상품 반환
    res.status(200).send(product);
  })
);

export default router;
