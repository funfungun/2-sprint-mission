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
      res.status(500).send({ message: "Internal server error" });
    }
  };
};

// 중고마켓 댓글 목록 조회 API
router.get(
  "/product/:productId",
  asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { cursor, limit = 10 } = req.query;

    // 기본 쿼리
    const query = {
      where: { productId },
      orderBy: { createdAt: "desc" },
      take: parseInt(limit),
    };

    // Cursor 페이지네이션 설정
    if (cursor) {
      query.cursor = { id: cursor };
      query.skip = 1; // Cursor 항목 제외
    }

    // 댓글 목록 조회
    const comments = await prisma.comment.findMany({
      ...query,
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    res.status(200).send(comments);
  })
);

// 자유게시판 댓글 목록 조회 API
router.get(
  "/article/:articleId",
  asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const { cursor, limit = 10 } = req.query;

    // 기본 쿼리
    const query = {
      where: { articleId },
      orderBy: { createdAt: "desc" },
      take: parseInt(limit),
    };

    // Cursor 페이지네이션 설정
    if (cursor) {
      query.cursor = { id: cursor };
      query.skip = 1; // Cursor 항목 제외
    }

    // 댓글 목록 조회
    const comments = await prisma.comment.findMany({
      ...query,
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    res.status(200).send(comments);
  })
);

export default router;
