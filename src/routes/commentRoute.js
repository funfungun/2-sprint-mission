import express from "express";
import { PrismaClient } from "@prisma/client";
import { CreateComment, PatchComment } from "../struct.js";
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

// 중고마켓 댓글 등록 API
router.post(
  "/product/:productId",
  asyncHandler(async (req, res) => {
    const { productId } = req.params;

    // 요청 본문 검증 (CreateComment 구조체 사용)
    assert(req.body, CreateComment);

    const { content } = req.body;

    // 댓글 등록
    const comment = await prisma.comment.create({
      data: {
        content,
        productId, // 중고마켓 상품에 대한 댓글
      },
    });

    res.status(201).send(comment); // 등록된 댓글 반환
  })
);

// 자유게시판 댓글 등록 API
router.post(
  "/article/:articleId",
  asyncHandler(async (req, res) => {
    const { articleId } = req.params;

    // 요청 본문 검증 (CreateComment 구조체 사용)
    assert(req.body, CreateComment);

    const { content } = req.body;

    // 댓글 등록
    const comment = await prisma.comment.create({
      data: {
        content,
        articleId, // 자유게시판 게시글에 대한 댓글
      },
    });

    res.status(201).send(comment); // 등록된 댓글 반환
  })
);

// 중고마켓 댓글 수정 API
router.patch(
  "/product/:productId/:commentId",
  asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    // 요청 본문 검증 (PatchComment 구조체 사용)
    assert(req.body, PatchComment);

    const { content } = req.body;

    // 댓글 수정
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    res.status(200).send(comment); // 수정된 댓글 반환
  })
);

// 자유게시판 댓글 수정 API
router.patch(
  "/article/:articleId/:commentId",
  asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    // 요청 본문 검증 (PatchComment 구조체 사용)
    assert(req.body, PatchComment);

    const { content } = req.body;

    // 댓글 수정
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    res.status(200).send(comment); // 수정된 댓글 반환
  })
);

// 중고마켓 댓글 삭제 API
router.delete(
  "/product/:productId/:commentId",
  asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    // 댓글 삭제
    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.status(204).send(); // No Content 응답 (삭제 성공)
  })
);

// 자유게시판 댓글 삭제 API
router.delete(
  "/article/:articleId/:commentId",
  asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    // 댓글 삭제
    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.status(204).send(); // No Content 응답 (삭제 성공)
  })
);

export default router;
