import Menu from "../../components/HomeMenu/HomeMenu";
import './Home.css';
function HomePage() {

    return (
        <div className='homepage'>
            <img className="bg_image" src="/gameoflife.gif" alt="Game of Life GIF"/>
            <div className="bg_blur"></div>
            <Menu />
        </div>
    );
}

export default HomePage;