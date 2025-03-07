import express from "express";
import { PrismaClient } from "@prisma/client";
import { CreateProduct, PatchProduct } from "../struct.js";
import { assert } from "superstruct";

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
    // 요청 본문 검증
    assert(req.body, CreateProduct);

    // 상품 생성
    const { name, description, price, tags } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags,
      },
    });

    res.status(201).send(product); // 생성된 상품 반환
  })
);

// 상품 상세 조회 API (GET)
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // 상품 상세 조회
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

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send(product); // 상품 정보 반환
  })
);

// 상품 수정 API (PATCH)
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // 요청 본문 검증
    assert(req.body, PatchProduct);

    // 상품 수정
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: req.body, // 요청 본문으로 전달된 수정된 데이터
    });

    res.status(200).send(updatedProduct); // 수정된 상품 반환
  })
);

// 상품 삭제 API (DELETE)
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // 상품 삭제
    const product = await prisma.product.delete({
      where: { id },
    });

    res.status(200).send({ message: "Product deleted successfully", product });
  })
);

export default router;
