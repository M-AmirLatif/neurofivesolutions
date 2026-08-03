import { Footer, Header, Hero } from './components/Layout';
import SubmissionForm from './components/SubmissionForm';
import SubmissionGallery from './components/SubmissionGallery';
import Toast from './components/Toast';
export default function App(){return <div className="app-shell"><Header/><main id="top"><Hero/><SubmissionForm/><SubmissionGallery/></main><Footer/><Toast/></div>}