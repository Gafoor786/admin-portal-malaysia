
import { Backdrop, CircularProgress } from '@mui/material';
// import { useParams } from 'react-router';
// import { useState } from 'react';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';


interface LoadingProps {
    isOpen: boolean;
    message?: string;
}


// const Loading: React.FC<LoadingProps> = ({  isOpen: boolean; }) => {

//     // const { loading } = useParams<{ loading: boolean; }>(props.loading);
//     const [loading, setLoading] = useState(loadingProps.);
//     return (
//         <div>
//             Upcoming
//         </div>
//     );
// };

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            // zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }),
);


const Loading: React.FC<LoadingProps> = ({ isOpen, message }) => {
    const classes = useStyles();
    // const [open, setOpen] = useState(isOpen);
    return (
        <Backdrop className={classes.backdrop} open={isOpen} sx={{ zIndex: (theme) => theme.zIndex.drawer + 2000 }} >
            <CircularProgress color="inherit" />
            {
                message ? <span>{message}</span> : null
            }
        </Backdrop>
    )
}




// const Loading: React.FC<DispatchProps> = ({ onSubmit }) => {
//     const [
//         { errors, loading },
//         { onOptionSelected, onSubmit: _onSubmit },
//     ] = useAddToCart(onSubmit)
//     const _onOptionSelected = useCallback((
//         e: React.MouseEvent<HTMLInputElement, MouseEvent>,
//     ) => {
//         onOptionSelected({ [e.currentTarget.name]: e.currentTarget.value })
//     }, [onOptionSelected])
//     return (
//         <form onSubmit={_onSubmit}>
//             <fieldset>
//                 <legend>Size</legend>
//                 {['S', 'M', 'L'].map((size, i) => (
//                     <input
//                         key={i}
//                         type="radio"
//                         name="size"
//                         value={size}
//                         onClick={_onOptionSelected}
//                     />
//                 ))}
//             </fieldset>
//             {errors.map(({ message }) => <p>{message}</p>)}
//             <button type="submit" disabled={loading}>
//                 {loading ? 'Adding...' : 'Add to Cart'}
//             </button>
//         </form>
//     )
// }


export default Loading;
