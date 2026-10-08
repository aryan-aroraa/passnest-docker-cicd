import { useState, useRef, useEffect } from "react"
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const ref = useRef()
    const passRef = useRef()
    const [form, setForm] = useState({ site: "", username: "", password: "", show: false })
    const [passwordArray, setPasswordArray] = useState([])


    const showPass = (id, show) => {
        setPasswordArray(prev =>
            prev.map(item =>
                item.id === id ? { ...item, show: !show } : item
            )
        );
    };

    const getPasswords = async () => {
        const res = await fetch("http://localhost:3000/")
        const passwords = await res.json()
        console.log(passwords)
        setPasswordArray(passwords)
    }
    useEffect(() => {
        getPasswords()

    }, [])


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const toggleEye = () => {
        // console.log(ref.current.src)
        // console.log(ref.current.src.includes("icons/eye.png"));

        if (ref.current.src.includes("icons/eye.svg")) {
            ref.current.src = "icons/eyecross.svg"
            passRef.current.type = "text"
        }
        else {
            ref.current.src = "icons/eye.svg"
            passRef.current.type = "password"
        }


    }

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            const newPassword = { ...form, id: uuidv4() };

            setPasswordArray([...passwordArray, newPassword]);

            await fetch("http://localhost:3000/", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(newPassword),
            });

            toast.success("Password saved successfully!", {
                position: "bottom-right",
                autoClose: 2000,
                theme: "dark",
            });

            setForm({ site: "", username: "", password: "", show: false });
            // Reset input type
            if (passRef.current) passRef.current.type = "password";
            if (ref.current) ref.current.src = "icons/eye.svg"; // reset eye icon
        } else {
            toast.error("Invalid input", {
                position: "bottom-right",
                autoClose: 2000,
                theme: "colored",
            });
        }
    };

    const deletePassword = async (id, skipToast = false) => {
        let c = true;
        if (!skipToast) {
            c = confirm("Are you sure you want to delete the password?")
        }

        if (c) {
            const newArr = passwordArray.filter((item) => {
                return item.id !== id
            })
            setPasswordArray(newArr)
            // localStorage.setItem("passwords", JSON.stringify(newArr))
            await fetch("http://localhost:3000/", {
                method: "DELETE",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ id })
            })
            console.log(passwordArray)

            if (!skipToast) {
                toast.success('Password Deleted!', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }

        }

    }
    const editPassword = (id) => {

        const editElement = passwordArray.filter((item) => {
            return item.id === id
        })
        console.log(editElement[0])
        setForm(editElement[0])
        deletePassword(id, true)


    }

    const copyText = (text) => {
        navigator.clipboard.writeText(text)
        toast.success('Text copied!', {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }

    return (
        <>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="colored"
            />


            <div className="mycontainer text-white">
                <h1 className='font-bold text-3xl md:text-4xl xl:text-6xl text-center'>
                    <span className="text-green-500">&lt; </span>
                    Pass
                    <span className="text-green-500">Tube /&gt;</span>
                </h1>
                <h2 className='text-green-500 font-semibold text-center text-lg md:text-2xl'>A safe home for all your passwords.</h2>

                <div className='flex flex-col p-4 gap-8 items-center text-black my-15'>
                    <input
                        className='bg-white/10 backdrop-blur-md text-white w-full rounded-full px-5 py-3'
                        type="text"
                        value={form.site}
                        name="site"
                        onChange={handleChange}
                        placeholder='Enter website URL'
                    />
                    <div className="flex flex-col md:flex-row gap-8 w-full">
                        <input
                            className='bg-white/10 backdrop-blur-md text-white w-full md:w-1/2 rounded-full px-5 py-3'
                            type="text"
                            value={form.username}
                            name="username"
                            onChange={handleChange}
                            placeholder='Enter username'
                        />
                        <div className="relative flex items-center w-full md:w-1/2">
                            <input
                                className='bg-white/10 backdrop-blur-md text-white w-full rounded-full px-5 py-3'
                                ref={passRef}
                                type="password"
                                value={form.password}
                                name="password"
                                onChange={handleChange}
                                placeholder='Enter password'
                            />
                            <span className='absolute right-0 px-4 cursor-pointer text-white' onClick={toggleEye}><img width={20} ref={ref} src="icons/eye.svg" alt="eye" /></span>
                        </div>
                    </div>

                    <button onClick={savePassword} className='group flex gap-2 font-medium justify-center items-center border border-green-700 bg-green-500 rounded-full px-4 py-2 w-fit hover:bg-green-400 transition-colors'>
                        <lord-icon
                            src="https://cdn.lordicon.com/efxgwrkc.json"
                            trigger="hover"
                            target=".group">

                        </lord-icon>
                        Add password
                    </button>

                    {passwordArray.length === 0
                        ?
                        <div className="text-white/80 font-bold md:text-xl bg-white/8 backdrop-blur-4xl w-full rounded-xl h-50 flex justify-center items-center">
                            <p>No passwords to display</p>
                        </div>
                        :
                        <table className="table-auto border w-full border-white rounded-xl overflow-hidden hidden lg:table">
                            <thead className="bg-white/15 backdrop-blur-4xl text-white md:text-xl">
                                <tr>
                                    <th className="py-3">Website URL</th>
                                    <th className="py-3">Username</th>
                                    <th className="py-3">Password</th>
                                    <th className="py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white/8 backdrop-blur-4xl text-white text-center">
                                {passwordArray.map((item) => {
                                    return (
                                        <tr key={item.id} className="border-b border-neutral-700">
                                            <td className="py-3 px-5 border-r border-neutral-700 break-all min-w-xs">
                                                <div>
                                                    <a href={item.site} target="blank">{item.site}</a>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 border-r border-neutral-700 max-w-sm">
                                                <div className="flex justify-between items-center gap-4 px-5">
                                                    <div>
                                                        {item.username}
                                                    </div>
                                                    <div className="cursor-pointer w-[25px] h-[25px]" onClick={() => copyText(item.username)}>
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/iykgtsbt.json"
                                                            trigger="hover"
                                                            colors="primary:#b1b1b1"
                                                            style={{ "width": "25px", "height": "25px" }}
                                                        >
                                                        </lord-icon>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 border-r border-neutral-700">
                                                <div className="flex justify-between items-center gap-4 px-5">
                                                    <div>
                                                        {item.show ? item.password : "•".repeat(item.password.length)}
                                                    </div>
                                                    <div className="cursor-pointer w-[25px] h-[25px]" onClick={() => copyText(item.password)}>
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/iykgtsbt.json"
                                                            trigger="hover"
                                                            colors="primary:#b1b1b1"
                                                            style={{ "width": "25px", "height": "25px" }}
                                                        >
                                                        </lord-icon>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-10">
                                                <div className="flex justify-center gap-5">
                                                    <span className="cursor-pointer flex items-center" onClick={() => showPass(item.id, item.show)}>
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/dicvhxpz.json"
                                                            trigger="hover"
                                                            stroke="bold"
                                                            state="hover-look-around"
                                                            colors="primary:#ffffff,secondary:#ffffff"
                                                            style={{ "width": "25px", "height": "25px" }}
                                                        >
                                                        </lord-icon>
                                                    </span>
                                                    <span className="cursor-pointer flex items-center" onClick={() => editPassword(item.id)}>
                                                        <lord-icon
                                                            // edit icon
                                                            src="https://cdn.lordicon.com/gwlusjdu.json"
                                                            trigger="hover"
                                                            colors="primary:#b1b1b1"
                                                            style={{ "width": "25px", "height": "25px" }}>
                                                        </lord-icon>
                                                    </span>
                                                    <span className="cursor-pointer flex items-center" onClick={() => deletePassword(item.id)}>
                                                        <lord-icon
                                                            // delete icon
                                                            src="https://cdn.lordicon.com/xyfswyxf.json"
                                                            trigger="hover"
                                                            colors="primary:#b1b1b1"
                                                            style={{ "width": "25px", "height": "25px" }}>
                                                        </lord-icon>
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    }

                    <div className="lg:hidden grid grid-cols-1 md:grid md:grid-cols-2 gap-4 w-screen px-3">
                        {passwordArray.map((item) => {
                            return (
                                <div key={item.id} className="text-white bg-white/8 backdrop-blur-4xl rounded-xl p-3 flex flex-col gap-3 w-full">
                                    <div className="bg-white/20 backdrop-blur-3xl rounded-lg py-2 px-3 flex flex-col gap-1">
                                        <p className="text-[#b9b9b9]">Website URL</p>
                                        <p className="font-medium break-words"><a href={item.site} target="_blank">{item.site}</a></p>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-3xl rounded-lg py-2 px-3 flex flex-col gap-1">
                                        <p className="text-[#b9b9b9]">Username</p>
                                        <div className="flex justify-between gap-5">
                                            <p className="font-medium break-words">{item.username}</p>
                                            <div className="cursor-pointer w-[25px] h-[25px]" onClick={() => copyText(item.username)}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover"
                                                    colors="primary:#b1b1b1"
                                                    style={{ "width": "25px", "height": "25px" }}
                                                >
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-3xl rounded-lg py-2 px-3 flex flex-col gap-1">
                                        <p className="text-[#b9b9b9]">Password</p>
                                        <div className="flex justify-between gap-5">
                                            <p className="font-medium break-words">{item.show ? item.password : "•".repeat(item.password.length)}</p>
                                            <div className="cursor-pointer w-[25px] h-[25px]" onClick={() => copyText(item.password)}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover"
                                                    colors="primary:#b1b1b1"
                                                    style={{ "width": "25px", "height": "25px" }}
                                                >
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-evenly gap-5">
                                        <span className="cursor-pointer flex items-center" onClick={() => showPass(item.id, item.show)}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/dicvhxpz.json"
                                                trigger="hover"
                                                stroke="bold"
                                                state="hover-look-around"
                                                colors="primary:#ffffff,secondary:#ffffff"
                                                style={{ "width": "25px", "height": "25px" }}
                                            >
                                            </lord-icon>
                                        </span>
                                        <span className="cursor-pointer flex items-center" onClick={() => editPassword(item.id)}>
                                            <lord-icon
                                                // edit icon
                                                src="https://cdn.lordicon.com/gwlusjdu.json"
                                                trigger="hover"
                                                colors="primary:#b1b1b1"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        </span>
                                        <span className="cursor-pointer flex items-center" onClick={() => deletePassword(item.id)}>
                                            <lord-icon
                                                // delete icon
                                                src="https://cdn.lordicon.com/xyfswyxf.json"
                                                trigger="hover"
                                                colors="primary:#b1b1b1"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div >

        </>
    )
}

export default Manager
