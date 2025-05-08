import { Link } from 'react-router';

function HomeBar({loggedInAs, setLoggedInAs}){

    //TO-DO: Render Score

    return (<>
        <div className='card'>
            <Link to='/'><div className='card'>Home</div></Link>
            {loggedInAs && <>
                <p> Hello, {loggedInAs}! </p>
                <button onClick={(e)=>setLoggedInAs('')}>Logout</button>
            </>}
        </div>
    </>)

}

export default HomeBar;
