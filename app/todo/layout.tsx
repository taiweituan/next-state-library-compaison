export default function TodoLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <main>
          <section className="bg-white dark:bg-gray-900">
            <div className="mx-auto grid max-w-(--breakpoint-xl) px-4 py-8 text-center lg:py-16">{children}</div>
          </section>
        </main>
      </body>
    </html>
  )
}
