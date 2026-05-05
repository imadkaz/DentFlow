import { Target, Users, Award, TrendingUp, Heart, Shield } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Patient-Centered",
      description: "Everything we build is designed to improve patient care and experience."
    },
    {
      icon: Shield,
      title: "Security First",
      description: "HIPAA compliance and data security are at the core of our platform."
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "We continuously evolve our platform with the latest technology."
    },
    {
      icon: Users,
      title: "Partnership",
      description: "We succeed when your practice succeeds. We're in this together."
    }
  ];

  const stats = [
    { number: "5,000+", label: "Dental Practices" },
    { number: "2M+", label: "Patients Served" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  const team = [
    {
      name: "Dr. Sarah Mitchell",
      role: "CEO & Co-Founder",
      bio: "Former dentist with 15 years of clinical experience",
      color: "blue"
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      bio: "Healthcare technology expert, ex-Google engineer",
      color: "emerald"
    },
    {
      name: "Dr. James Rodriguez",
      role: "Chief Dental Officer",
      bio: "20+ years in practice management and dental education",
      color: "purple"
    },
    {
      name: "Emily Thompson",
      role: "Head of Customer Success",
      bio: "Dedicated to ensuring every practice achieves their goals",
      color: "blue"
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-linear-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-linear-to-r from-blue-50 to-emerald-50 rounded-full mb-6 border border-blue-200">
            <span className="text-sm text-blue-700">🏥 About DentFlow</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Transforming Dental Practice Management
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Founded by dentists, built for dentists. We understand the unique challenges 
            of running a modern dental practice because we've lived them.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold bg-linear-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  DentFlow was born in 2018 when Dr. Sarah Mitchell, a practicing dentist, 
                  became frustrated with outdated practice management software that slowed down 
                  her clinic instead of helping it grow.
                </p>
                <p>
                  She partnered with Michael Chen, a healthcare technology expert, to create 
                  a modern, intuitive platform that would actually work the way dental practices 
                  operate in the real world.
                </p>
                <p>
                  Today, DentFlow powers over 5,000 dental practices across North America, 
                  helping them deliver better patient care while running more efficient operations. 
                  But we're just getting started.
                </p>
              </div>
            </div>

            <div className="bg-linear-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 text-white">
              <div className="flex items-start gap-4">
                <Target className="w-8 h-8 shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
                  <p className="text-lg text-blue-100">
                    To empower dental practices with intelligent, user-friendly technology 
                    that enhances patient care, streamlines operations, and enables practices 
                    to focus on what they do best—providing exceptional dental care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-linear-to-b from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all"
                >
                  <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Leadership</h2>
            <p className="text-xl text-gray-600">
              Experienced professionals dedicated to your success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => {
              const gradients = {
                blue: "from-blue-400 to-blue-600",
                emerald: "from-emerald-400 to-emerald-600",
                purple: "from-purple-400 to-purple-600"
              };
              const gradient = gradients[member.color as keyof typeof gradients];

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all text-center"
                >
                  <div className={`w-24 h-24 mx-auto mb-4 bg-linear-to-br ${gradient} rounded-full`} />
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600">
                    {member.bio}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-linear-to-r from-blue-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <Award className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Join the DentFlow Family
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Become part of a community of forward-thinking dental practices
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/get-started"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-medium hover:shadow-2xl transition-all duration-200"
            >
              Start Free Trial
            </a>
            <a
              href="/contact"
              className="px-8 py-4 bg-blue-700/50 text-white rounded-xl font-medium border-2 border-white/30 hover:bg-blue-700/70 transition-all duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
