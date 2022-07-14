import bcrypt from "bcrypt";
import {prisma} from "../lib/db";

async function main() {
  const user1 = await prisma.user.upsert({
    where: {cnic: '1234567891234'},
    update: {
      password: bcrypt.hashSync('123456', 8),
    },
    create: {
      cnic: '1234567891234',
      name: 'admin',
      role: 'admin',
      password: bcrypt.hashSync('123456', 8),
    },
  });

  console.log({user1});
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })