import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-linear-to-b from-gray-50 to-gray-100 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                                DentFlow
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Modern dental practice management software designed to streamline operations and improve patient care.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-md transition-all">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-md transition-all">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-md transition-all">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-md transition-all">
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Product</h4>
                        <ul className="space-y-3">
                            <li><Link href="/features" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Features</Link></li>
                            <li><Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Pricing</Link></li>
                            <li><Link href="/integrations" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Integrations</Link></li>
                            <li><Link href="/updates" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Updates</Link></li>
                            <li><Link href="/api" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">API</Link></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">About Us</Link></li>
                            <li><Link href="/careers" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Careers</Link></li>
                            <li><Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Blog</Link></li>
                            <li><Link href="/press-kit" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Press Kit</Link></li>
                            <li><Link href="/partners" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Partners</Link></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-gray-600 text-sm">
                                <Mail className="w-4 h-4 text-blue-600" />
                                <Link href="mailto:ikazbour3@gmail.com" className="hover:text-blue-600 transition-colors">
                                    ikazbour3@gmail.com
                                </Link>
                            </li>
                            <li className="flex items-center gap-2 text-gray-600 text-sm">
                                <Phone className="w-4 h-4 text-blue-600" />
                                <Link href="tel:+1234567890" className="hover:text-blue-600 transition-colors">
                                    +1 (234) 567-890
                                </Link>
                            </li>
                            <li className="flex items-center gap-2 text-gray-600 text-sm">
                                <Phone className="w-4 h-4 text-blue-600" />
                                <Link href="tel:+1234567890" className="hover:text-blue-600 transition-colors">
                                    +1 (234) 567-890
                                </Link>
                            </li>
                            <li className="flex items-start gap-2 text-gray-600 text-sm">
                                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <span>123 Dental Street<br />San Francisco, CA 94102</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-300">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-600">
                            © 2026 DentFlow. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
