import classes from './Placed.module.css';
import Modal from '../UI/Modal';
import tickImage from '../../assets/modal_tick.svg';
const Placed=(props)=>{

return(
    <Modal>
        <div className={classes.content}>
        <img src={tickImage} alt='Tick' />
        Thanks for ordering! Visit Again!!
        </div>
    </Modal>
)
}

export default Placed;