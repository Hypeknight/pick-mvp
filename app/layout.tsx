import './globals.css'; import Link from 'next/link';
export const metadata={title:'PICK — Ask. Pick. Reveal.',description:'Make a decision. Ask everyone.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><nav className="nav"><Link className="brand" href="/">P<span className="accent">I</span>CK</Link><div className="row"><Link href="/create">Create</Link><Link href="/dashboard">My Picks</Link></div></nav>{children}</body></html>}
