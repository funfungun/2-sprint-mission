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

export default router;
