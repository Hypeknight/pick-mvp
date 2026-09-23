import './globals.css';import Link from 'next/link';import AuthNav from './AuthNav';
export const metadata={title:'PICK — Ask. Pick. Reveal.',description:'Make a decision. Ask everyone.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><nav className="nav"><Link className="brand" href="/">P<span className="accent">I</span>CK</Link><AuthNav/></nav>{children}</body></html>}
