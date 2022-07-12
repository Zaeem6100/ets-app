import bcrypt from "bcrypt";
import {prisma} from "../lib/db";

async function main() {
  const admin = await prisma.user.upsert({
    where: {cnic: '1234567891234'},
    update: {},
    create: {
      cnic: '1234567891234',
      name: 'admin',
      role: 'admin',
      password: bcrypt.hashSync('123456', 8),
    },
  });

  const teacher = await prisma.user.upsert({
    where: {cnic: '1234567891235'},
    update: {},
    create: {
      cnic: '1234567891235',
      name: 'Teacher',
      role: 'teacher',
      password: bcrypt.hashSync('123456', 8),
    },
  });

  console.log({admin, teacher});
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })