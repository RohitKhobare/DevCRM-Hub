import { Link } from 'react-router-dom';
import { Heart, Zap, Target, Users, Rocket } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

export function AboutPage() {
  const team = [
    {
      name: 'Arjun Singh',
      role: 'Founder & CEO',
      bio: 'Serial entrepreneur with 10+ years of experience building SaaS products.',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=300',
    },
    {
      name: 'Priya Sharma',
      role: 'CTO',
      bio: 'Full-stack developer passionate about building scalable platforms.',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=300',
    },
    {
      name: 'Vikram Patel',
      role: 'Head of Product',
      bio: 'Product strategist focused on creating delightful user experiences.',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=300',
    },
    {
      name: 'Neha Gupta',
      role: 'Head of Customer Success',
      bio: 'Customer-focused leader dedicated to helping clients succeed.',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=300',
    },
  ];

  const techStack = [
    { name: 'React', category: 'Frontend' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Supabase', category: 'Platform' },
    { name: 'Tailwind CSS', category: 'Styling' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'AWS', category: 'Infrastructure' },
    { name: 'Redis', category: 'Caching' },
    { name: 'GraphQL', category: 'API' },
    { name: 'Jest', category: 'Testing' },
    { name: 'Kubernetes', category: 'Orchestration' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We prioritize customer success and build features that solve real problems.',
    },
    {
      icon: Zap,
      title: 'Speed & Quality',
      description: 'Rapid innovation without compromising on code quality or performance.',
    },
    {
      icon: Target,
      title: 'Focused',
      description: 'We stay focused on our core mission: empowering developers and businesses.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We believe in building a vibrant community of developers and entrepreneurs.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            About DevCRM Hub
          </h1>
          <p className="text-xl text-slate-200">
            Building tools that empower developers and businesses to grow
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8 text-center">
            Our Story
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              DevCRM Hub was born from a simple observation: developers and small businesses were struggling to find good tools that worked seamlessly together. They needed a CRM to manage client relationships, a marketplace to discover and sell solutions, and a SaaS platform to scale their operations—all in one place.
            </p>
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              Our founder, Arjun Singh, experienced this problem firsthand while building his own software consulting business. He spent months integrating different tools, dealing with data silos, and managing multiple subscriptions. That's when the idea for DevCRM Hub was conceived.
            </p>
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              After assembling a talented team of developers, designers, and product experts, we spent the next 18 months building DevCRM Hub from the ground up. Today, we serve thousands of developers, consultants, and small businesses who use our platform to manage clients, discover solutions, and grow their revenue.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              We're just getting started. Our mission is to become the go-to platform for developers and businesses in India and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl p-8 shadow-md border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                <Target className="h-6 w-6 text-blue-600 mr-3" />
                Our Mission
              </h3>
              <p className="text-lg text-slate-700 leading-relaxed">
                To empower developers and businesses with powerful, integrated tools that help them manage client relationships, discover innovative solutions, and scale their operations efficiently.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md border-l-4 border-emerald-600">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                <Rocket className="h-6 w-6 text-emerald-600 mr-3" />
                Our Vision
              </h3>
              <p className="text-lg text-slate-700 leading-relaxed">
                To be the leading all-in-one platform trusted by hundreds of thousands of developers, consultants, and businesses to build, manage, and grow their ventures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12 text-center">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div key={i} className="bg-slate-50 rounded-xl p-8 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 ml-4">
                      {value.title}
                    </h3>
                  </div>
                  <p className="text-slate-700">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium text-sm mb-3">
                    {member.role}
                  </p>
                  <p className="text-slate-600 text-sm">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 text-center">
            Built With Modern Tech
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            We use the latest and greatest technologies to build a fast, reliable, and scalable platform
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {techStack.map((tech, i) => (
              <div
                key={i}
                className="bg-slate-50 rounded-lg p-4 text-center hover:bg-blue-50 transition-colors border border-slate-200"
              >
                <div className="font-semibold text-slate-900 text-sm">
                  {tech.name}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {tech.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12 text-center">
            Our Journey
          </h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="h-16 w-1 bg-slate-300 mt-2 mb-2"></div>
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Idea to MVP (Q1 2023)
                </h3>
                <p className="text-slate-600">
                  Started with the core CRM functionality and basic marketplace features. Reached first 100 users.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="h-16 w-1 bg-slate-300 mt-2 mb-2"></div>
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Expansion (Q3 2023)
                </h3>
                <p className="text-slate-600">
                  Launched advanced features, improved marketplace, and reached 1,000 active users with positive feedback.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="h-16 w-1 bg-slate-300 mt-2 mb-2"></div>
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Growth (Q2 2024)
                </h3>
                <p className="text-slate-600">
                  Hit 10,000 users, launched team collaboration features, and became a trusted platform for developers.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                  4
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Today & Beyond
                </h3>
                <p className="text-slate-600">
                  Serving thousands of developers, planning expansion to new markets, and building exciting new features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Become part of a growing community of developers and entrepreneurs
          </p>
          <Link
            to="/auth/signup"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
