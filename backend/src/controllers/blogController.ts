import { Request, Response } from "express";
import { prisma } from "../prisma/prisma";


const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};


export const getBlogs = async (req: Request, res: Response) => {
  try {
    const { published_only } = req.query;

    const whereCondition: any = {};
    if (published_only === 'true') {
      whereCondition.is_published = true;
    }

    const blogs = await prisma.blog.findMany({
      where: whereCondition,
      orderBy: { created_at: 'desc' },
    });

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mengambil daftar artikel blog',
      data: blogs,
    });
  } catch (error) {
    console.error('getBlogs error: ', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Terjadi kesalahan pada server saat mengambil data blog',
    });
  }
};

// Get blog by ID or Slug
export const getBlogByIdOrSlug = async (req: Request, res: Response) => {
  try {
    const param = req.params.param as string;
    const blogId = parseInt(param, 10);

    let blog = null;
    if (!isNaN(blogId)) {
      blog = await prisma.blog.findUnique({ where: { id: blogId } });
    } else {
      blog = await prisma.blog.findUnique({ where: { slug: param } });
    }

    if (!blog) {
      return res.status(404).json({
        status: 'Error',
        message: 'Artikel blog tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mengambil detail artikel blog',
      data: blog,
    });
  } catch (error) {
    console.error('getBlogByIdOrSlug error: ', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Terjadi kesalahan pada server saat mengambil detail blog',
    });
  }
};

// Create Blog
export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, excerpt, content, author, is_published } = req.body;
    const image = req.file ? req.file.path : req.body.image;

    if (!title || !excerpt || !content) {
      return res.status(400).json({
        status: 'Error',
        message: 'Judul, ringkasan (excerpt), dan isi artikel wajib diisi',
      });
    }

    if (!image) {
      return res.status(400).json({
        status: 'Error',
        message: 'Gambar cover artikel wajib diunggah',
      });
    }

    let slug = createSlug(title);
    const existingSlug = await prisma.blog.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const newBlog = await prisma.blog.create({
      data: {
        title: title.trim(),
        slug,
        excerpt: excerpt.trim(),
        content: content.trim(),
        image,
        author: author ? author.trim() : 'Admin Bandeng Sanjaya',
        is_published: is_published === undefined ? true : is_published === 'true' || is_published === true,
      },
    });

    return res.status(201).json({
      status: 'Success',
      message: 'Artikel blog berhasil ditambahkan',
      data: newBlog,
    });
  } catch (error) {
    console.error('createBlog error: ', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Terjadi kesalahan pada server saat menambahkan blog',
    });
  }
};

// Update Blog
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const blogId = parseInt(id, 10);

    if (isNaN(blogId)) {
      return res.status(400).json({
        status: 'Error',
        message: 'ID blog tidak valid',
      });
    }

    const existingBlog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!existingBlog) {
      return res.status(404).json({
        status: 'Error',
        message: 'Artikel blog tidak ditemukan',
      });
    }

    const { title, excerpt, content, author, is_published } = req.body;
    const image = req.file ? req.file.path : existingBlog.image;

    const updateData: any = { image };

    if (title) {
      updateData.title = title.trim();
      updateData.slug = createSlug(title);
    }
    if (excerpt) updateData.excerpt = excerpt.trim();
    if (content) updateData.content = content.trim();
    if (author) updateData.author = author.trim();
    if (is_published !== undefined) {
      updateData.is_published = is_published === 'true' || is_published === true;
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: updateData,
    });

    return res.status(200).json({
      status: 'Success',
      message: 'Artikel blog berhasil diperbarui',
      data: updatedBlog,
    });
  } catch (error) {
    console.error('updateBlog error: ', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Terjadi kesalahan pada server saat memperbarui blog',
    });
  }
};

// Delete Blog
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const blogId = parseInt(id, 10);

    if (isNaN(blogId)) {
      return res.status(400).json({
        status: 'Error',
        message: 'ID blog tidak valid',
      });
    }

    const existingBlog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!existingBlog) {
      return res.status(404).json({
        status: 'Error',
        message: 'Artikel blog tidak ditemukan',
      });
    }

    await prisma.blog.delete({ where: { id: blogId } });

    return res.status(200).json({
      status: 'Success',
      message: 'Artikel blog berhasil dihapus',
    });
  } catch (error) {
    console.error('deleteBlog error: ', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Terjadi kesalahan pada server saat menghapus blog',
    });
  }
};
