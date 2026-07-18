import { ArrowRight } from 'lucide-react';import styles from './Button.module.css';
export default function Button({children,variant='primary',href='#pricing',icon=false,className=''}){return <a className={`${styles.button} ${styles[variant]} ${className}`} href={href}>{children}{icon&&<ArrowRight size={18} aria-hidden="true"/>}</a>}
