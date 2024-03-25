var express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const router = express.Router();

router.use(morgan('dev'));
router.use(express.json());

router.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 全てのタスクを取得する
router.get('/', async function (req:any, res:any, next:any) {
  try {
    const tasks = await prisma.todo.findMany();
    res.json({tasks});
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 特定のIDのタスクを取得
router.get('/api/tasks/:id', async function (req:any, res:any, next:any) {
  const id = req.params.id;
  try {
    const task = await prisma.todo.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// タスクの作成
router.post('/', async function (req:any, res:any, next:any) {
  const { title, content, dueDate } = req.body;
  try {
    const createTask = await prisma.todo.create({
      data: {
        title: title,
        content: content,
        dueDate: dueDate,
      },
    });
    res.json(createTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// タスクの更新
router.put('/api/tasks/:id', async function (req:any, res:any, next:any) {
  const id = req.params.id;
  const { title, content,dueDate } = req.body;
  try {
    const updateTask = await prisma.todo.update({
      where: {
        id: Number(id),
      },
      data: {
        title: title,
        content: content,
        dueDate: dueDate,
      },
    });
    res.json(updateTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//タスクの完了
router.post('/complete', async function (req:any, res:any, next:any) {
  const { taskId } = req.body;

  try {
    // タスクの完了ステータスを更新
    await prisma.todo.update({
      where: { id: taskId },
      data: { completed: true },
    });

    res.json({ message: 'Task completed successfully' });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// タスクの削除
router.delete('/api/tasks/:id', async function (req:any, res:any, next:any) {
  const id = req.params.id;
  try {
    const deleteTask = await prisma.todo.delete({
      where: {
        id: Number(id),
      },
    });
    res.json(deleteTask);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;






















