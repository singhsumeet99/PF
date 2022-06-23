import classes from './Payment.module.css';
import Modal from '../UI/Modal';

const Payment=(props)=>{

return(
    <Modal onClosePayment={props.onClose}>
        <div className={classes.content}>
            <div className={classes.type}>Pay by Debit/Credit card</div>
            <div className={classes.type}>Pay by UPI</div>
            <div className={classes.type}>Pay by Cash</div>
        </div>
    </Modal>
)
}

export default Payment;