import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to Checklist Manager
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Stay organized and boost your productivity with our simple yet powerful checklist application. 
          Create, manage, and track your tasks with ease.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/checklist"
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
          
          <Link 
            href="/checklist"
            className="px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            View Checklists
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Simple & Clean</h3>
            <p className="text-gray-600">Intuitive interface that makes task management effortless</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast & Responsive</h3>
            <p className="text-gray-600">Built with Next.js for optimal performance and user experience</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Stay Focused</h3>
            <p className="text-gray-600">Organize your tasks and maintain clarity on your goals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
