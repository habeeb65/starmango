
const testimonials = [
  {
    content: "TenantBloom transformed how I run my vegetable wholesale business. I've saved 6 hours daily on paperwork alone!",
    author: "Rajiv Patel",
    position: "Vegetable Wholesale Owner",
    location: "Gujarat, India"
  },
  {
    content: "The customizable dashboard helps me track all mango shipments and payments. It's like the system was built just for us.",
    author: "Maria Rodriguez",
    position: "Mango Export Manager",
    location: "Mexico City, Mexico"
  },
  {
    content: "Our pipe supply business has tripled in efficiency since implementing TenantBloom. The invoicing system is flawless.",
    author: "James Wilson",
    position: "Pipe Supply Director",
    location: "Manchester, UK"
  }
];

const TestimonialsSection = () => {
  return (
    <div className="py-24 bg-slate-50 dark:bg-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">What Our Customers Say</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Businesses across the globe trust TenantBloom for their wholesale operations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card-3d bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 rounded-xl flex flex-col"
            >
              <div className="mb-6">
                {/* Quote icon */}
                <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 mb-6 flex-1">"{testimonial.content}"</p>
              
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{testimonial.author}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{testimonial.position}, {testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
