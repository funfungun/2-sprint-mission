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
        res.status(404).send({ message: "Article not found" });
      } else {
        res.status(500).send({ message: "Internal server error" });
      }
    }
  };
};

// 게시글 목록 조회 API
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { offset = 0, limit = 10, order = "recent", search = "" } = req.query;
    let orderBy = { createdAt: "desc" }; // 기본값: 최신순 정렬

    if (order === "oldest") {
      orderBy = { createdAt: "asc" };
    }

    // 게시글 목록 조회 쿼리
    const articles = await prisma.article.findMany({
      skip: parseInt(offset), // 페이지네이션 offset
      take: parseInt(limit), // 페이지네이션 limit
      orderBy, // 정렬 기준
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } }, // 제목 검색
          { content: { contains: search, mode: "insensitive" } }, // 내용 검색
        ],
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    res.status(200).send(articles); // 성공 응답
  })
);

export default router;
