import './InfoCell.css';

function InfoCell(props) {
    console.log(props.icon);
    return (
        <div className='info_cell'>
            <img src={"/icons/" + props.icon} alt="" srcset="" />
            <h2>{props.title}</h2>
            <p>{props.text}</p>
        </div>
    );
}

export default InfoCell;