import Menu from "../../components/Menu/Menu";
import './Home.css';
function Home() {

    return (
        <div className='homepage'>
            <img className="bg_image" src="/gameoflife.gif" alt="Game of Life GIF"/>
            <div className="bg_blur"></div>
            <Menu />
        </div>
    );
}

export default Home;