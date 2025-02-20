import express from "express";
import { PrismaClient } from "@prisma/client";
import { CreateArticle, PatchArticle } from "../struct.js";
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

// 게시글 등록 API
router.post(
  "/",
  asyncHandler(async (req, res) => {
    // 요청 본문 검증
    assert(req.body, CreateArticle);

    const { title, content } = req.body;

    // 게시글 생성
    const article = await prisma.article.create({
      data: {
        title,
        content,
      },
    });

    res.status(201).send(article); // 생성된 게시글 반환
  })
);

// 게시글 상세 조회 API
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // 게시글 조회
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return res.status(404).send({ message: "Article not found" });
    }

    res.status(200).send(article); // 게시글 정보 반환
  })
);

// 게시글 수정 API
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // 요청 본문 검증 (PatchArticle 구조체 사용)
    assert(req.body, PatchArticle);

    const { title, content } = req.body;

    // 게시글 수정
    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
      },
    });

    res.status(200).send(article); // 수정된 게시글 반환
  })
);

// 게시글 삭제 API
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // 게시글 삭제
    const article = await prisma.article.delete({
      where: { id },
    });

    res.status(200).send(article); // 삭제된 게시글 정보 반환
  })
);

export default router;
