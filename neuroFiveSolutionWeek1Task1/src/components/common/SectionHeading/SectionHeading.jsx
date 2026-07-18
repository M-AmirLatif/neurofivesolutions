import useScrollReveal from '../../../hooks/useScrollReveal';import styles from './SectionHeading.module.css';
export default function SectionHeading({eyebrow,title,description}){const reveal=useScrollReveal();return <header ref={reveal.ref} className={`${styles.heading} ${reveal.className}`}><span>{eyebrow}</span><h2>{title}</h2>{description&&<p>{description}</p>}</header>}
