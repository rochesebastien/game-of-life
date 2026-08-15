import Menu from "../../components/HomeMenu/HomeMenu";
import './Home.css';
function HomePage() {

    return (
        <div className='homepage'>
            <img className="bg_image" src="/gameoflife.gif" alt="Game of Life GIF"/>
            <div className="bg_blur"></div>
            <Menu />
            
            <span className="credits">
                Made with 🖤 by
                <a href="https://sebastien-roche.fr" target="_blank" rel="noreferrer" data-tooltip="Visit my website">Seb</a>
                in 2024
            </span>
        </div>
    );
}

export default HomePage;