import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();
  await prisma.community.deleteMany();

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      username: 'alice_creator',
      fullName: 'Alice Johnson',
      password: hashedPassword,
      bio: 'Digital creator & AI enthusiast',
      avatar: '👩‍💻',
      profileMode: 'creator',
      isVerified: true,
      isCreator: true,
      privacyLevel: 'public',
      interests: ['AI', 'Technology', 'Blockchain'],
      skills: ['React', 'Node.js', 'Python'],
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      username: 'bob_dev',
      fullName: 'Bob Smith',
      password: hashedPassword,
      bio: 'Full-stack developer',
      avatar: '👨‍💻',
      profileMode: 'personal',
      isVerified: false,
      privacyLevel: 'public',
      interests: ['Web Development', 'Open Source'],
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'charlie@example.com',
      username: 'charlie_artist',
      fullName: 'Charlie Brown',
      password: hashedPassword,
      bio: 'Digital artist',
      avatar: '🎨',
      profileMode: 'creator',
      isVerified: true,
      privacyLevel: 'public',
      interests: ['Design', 'Art', 'Animation'],
    },
  });

  // Create posts
  await prisma.post.create({
    data: {
      content: 'Just launched NEXA 2030! Excited to build the future of social media 🚀',
      authorId: user1.id,
      visibility: 'public',
      isPublished: true,
    },
  });

  await prisma.post.create({
    data: {
      content: 'Working on AI integration for real-time recommendations',
      authorId: user2.id,
      visibility: 'public',
      isPublished: true,
    },
  });

  // Create communities
  const techCommunity = await prisma.community.create({
    data: {
      name: 'Tech Innovators',
      description: 'Community for tech creators and developers',
      creatorId: user1.id,
      isPrivate: false,
    },
  });

  const designCommunity = await prisma.community.create({
    data: {
      name: 'Design & Art',
      description: 'Creative designers and digital artists',
      creatorId: user3.id,
      isPrivate: false,
    },
  });

  // Add members to communities
  await prisma.communityMember.create({
    data: {
      userId: user1.id,
      communityId: techCommunity.id,
      role: 'admin',
    },
  });

  await prisma.communityMember.create({
    data: {
      userId: user2.id,
      communityId: techCommunity.id,
      role: 'member',
    },
  });

  await prisma.communityMember.create({
    data: {
      userId: user3.id,
      communityId: designCommunity.id,
      role: 'admin',
    },
  });

  // Create following relationships
  await prisma.following.create({
    data: {
      followerId: user2.id,
      followingId: user1.id,
    },
  });

  await prisma.following.create({
    data: {
      followerId: user3.id,
      followingId: user1.id,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\nTest Users:');
  console.log('- alice@example.com / password123');
  console.log('- bob@example.com / password123');
  console.log('- charlie@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
