const Navbar = () => {
    return (
        <nav className=" text-white">
            <div className="flex justify-between items-center mycontainer py-5">
                <div className="font-bold text-2xl">
                    <span className="text-green-500">&lt; </span>
                    Pass
                    <span className="text-green-500">Nest /&gt;</span>
                </div>
                <ul>
                    <li className="flex gap-5 text-xl">
                        <a href="/">Home</a>
                        <a href="#">About</a>
                        <a href="#">Contact</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
