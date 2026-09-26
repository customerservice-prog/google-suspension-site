import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'ProfilePath | Your next step back to business',description:'Find the right recovery path for a suspended Google Business Profile. Prepare evidence, organize your case and build a factual appeal.',icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
