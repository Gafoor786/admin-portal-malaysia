
// import { useLocation, useParams } from 'react-router';
import { useLocation } from 'react-router';

const NotFound: React.FC = () => {

    let location = useLocation();

    return (
        <div>
            <h3>
                No match for <code>{location.pathname}</code>
            </h3>
        </div>
    );
};

export default NotFound;
