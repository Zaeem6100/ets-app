import {NextApiRequest, NextApiResponse} from "next";
import {Exam} from "@prisma/client";
import {prisma} from "../../../../lib/db";

async function getRandomQuestions(exam: Exam, question_quantities: number[]): Promise<number[]> {
  let computed_questions: number[] = [];

  let amounts = [
    exam.amountDifficulty1,
    exam.amountDifficulty2,
    exam.amountDifficulty3,
    exam.amountDifficulty4,
    exam.amountDifficulty5
  ];

  let questions_arr = await Promise.all(amounts.map(
    async (amount, diff): Promise<number[]> => {
      if (amount <= 0) return [];
      let questions: any[] = await prisma.$queryRawUnsafe(
        'SELECT id FROM "Question" WHERE ("subjectId"=$1 AND "difficulty"=$2) ORDER BY RANDOM() LIMIT $3 OFFSET $4;',
        exam.subjectId,
        diff + 1,
        amount,
        Math.max(0, Math.floor(Math.random() * (question_quantities[diff] - amount))),
      );
      if (questions.length > 0) {
        return questions.map((question) => question.id);
      } else {
        return [];
      }
    }
  ));

  questions_arr.forEach((questions) => {
    computed_questions.push(...questions);
  });

  return computed_questions;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = parseInt(req.query.eid as string);
  const exam = await prisma.exam.findUnique({where: {id}});

  if (!exam) return res.status(400).json({});

  const totalQuestions =
    exam.amountDifficulty1 +
    exam.amountDifficulty2 +
    exam.amountDifficulty3 +
    exam.amountDifficulty4 +
    exam.amountDifficulty5;

  if (totalQuestions <= 0) res.status(403).json({err: 'Questions amount not defined'});

  // Queries
  let [students, ...question_quantities] = await Promise.all([
    prisma.student.findMany(),
    prisma.question.count({where: {AND: [{difficulty: 1}, {subjectId: exam.subjectId}]}}),
    prisma.question.count({where: {AND: [{difficulty: 2}, {subjectId: exam.subjectId}]}}),
    prisma.question.count({where: {AND: [{difficulty: 3}, {subjectId: exam.subjectId}]}}),
    prisma.question.count({where: {AND: [{difficulty: 4}, {subjectId: exam.subjectId}]}}),
    prisma.question.count({where: {AND: [{difficulty: 5}, {subjectId: exam.subjectId}]}}),
  ]);


  for (let student of students) {
    console.log('generating exam for student...')
    await prisma.student.update({
      where: {id: student.id},
      data: {
        StudentExam: {
          create: {
            Exam: {connect: {id: exam.id}},
            ComputedQuestion: {
              createMany: {
                data: (await getRandomQuestions(exam, question_quantities)).map((questionId) => {
                  return {questionId}
                }),
              },
            }
          }
        }
      }
    });
  }

  await prisma.exam.update({
    where: {id: parseInt(req.query.eid as string)},
    data: {status: "generated"}
  });

  return res.status(200).json({});
}
