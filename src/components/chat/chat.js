import React, {useContext, useState, useEffect} from 'react';
import {UserContext} from '../../context/userContext';
import {URL} from '../../variables';
import {io} from 'socket.io-client';
import {v4 as uuid} from 'uuid';
import moment from 'moment';

const Chat = () => {
    const user = useContext(UserContext);
    const [socket, setSocket] = useState(null);
    const [users, setUsers] = useState({users: []});
    const [message, setMessage] = useState('');
    const [alreadyConnected, setAlreadyConnected] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    

    useEffect(() => {
        connect()
    }, [])

    const connect = () => {
        //setup connection
        let newSocket = io(URL);
        //set socket state var
        setSocket(newSocket);
    }

    useEffect(() => {
        if (socket) {
            //attach events
            socket.on("get user", (data) => {
                returnUser(socket);
            })

            socket.on("user list", (data) => {
                setUsers({users: data});
            })

            socket.on("new user", (data) => {
                console.log("new user:", data)
                addUser(data);
            })

            socket.on("user left", (data) => {
                removeUser(data);
            })

            socket.on("update user", (data) => {
                updateUser(data);
            })

            socket.on("message", (data) => {
                receiveMessage(data);
            })

            socket.on("delivery report", (data) => {
                setUsers(prev => ({
                    users: prev.users.map((u) => {
                        if (u.iduser === data.iduser) {
                            u.messages = u.messages.map(m => {
                                if (m.idmessage === data.idmessage) {
                                    m.status = data.status;
                                    return m;
                                } else return m;
                            })
        
                            return u;
                        } else return u;
                    })
                }))
            })

            socket.on("reject", (data) => {
                rejection(data);
            })
        }

        return () => {
            if (socket) {
                socket.disconnect()
            }
        };
    }, [socket])

    useEffect(() => {
        //check if current user still online
        let isOnline = false;

        users.users && users.users.forEach((u) => {
            if (u.iduser === currentUser && u.chatWith === user.idadmins) {
                isOnline = true
            } 
        })

        if (!isOnline) setCurrentUser(null)
    }, [users])

    useEffect(() => {
        setUsers(prev => ({
            users: prev.users.map((u) => {
                if (u.iduser === currentUser) {
                    u.selected = true;
                    return u;
                } else {
                    u.selected = null;
                    return u;
                }
            })
        }))
    }, [currentUser])

    ///////////socket events///////////////////////////////////////////////////////////////////////////
    const returnUser = (socket) => {
        socket.emit("set user", {idadmins: user.idadmins, username: user.forenames.split(' ')[0]})
    }

    const updateUser = (data) => {
        setUsers(prev => ({
            users: prev.users.map(u => {
                if (u.iduser === data.iduser) {
                    return({
                        ...u,
                        chatWith: data.chatWith
                    })
                } else return({...u})
            })
        }));
    }

    const removeUser = (data) => {
        setUsers(prev => ({
            users: prev.users.filter(u => data.iduser !== u.iduser)
        }));
    }

    const addUser = (data) => {
        setUsers(prev => ({
            users: prev.users.concat(data)
        }));
    }

    const rejection = (data) => {
        switch (data.message) {
            case 'already connected':
                setAlreadyConnected(true)
                break;
            default:
        }
    }

    const receiveMessage = (data) => {
        let newMessage = {
            iduser: data.iduser,
            type: 'received',
            idmessage: data.idmessage,
            message: data.message,
            timestamp: Date.now()
        }

        socket.emit("admin-delivery", {iduser: data.iduser, idmessage: data.idmessage, status: 'delivered'})

        addMessage(newMessage);
    }

    const addMessage = (msg) => {

        setUsers(prev => ({
            users: prev.users.map((u) => {
                if (u.iduser === msg.iduser) {
                    let repeat = false;

                    u.messages && u.messages.forEach(element => {
                        if (element.idmessage === msg.idmessage) repeat = true;
                    });

                    if (repeat) return u;

                    if (u.messages) {
                        u.messages.push(msg)
                        if (msg.type === 'received') u.new++
                    } else {
                        u.messages = [msg]
                        if (msg.type === 'received') u.new = 1
                    }
                }

                return u;
            })
        }));
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////

    const selectUser = (iduser) => {
        socket.emit("select", {idadmins: user.idadmins, iduser: iduser})
    }

    const viewChat = (iduser) => {
        setCurrentUser(iduser);
    }

    const clearNewMessages = (iduser) => {
        setUsers(prev => ({
            users: prev.users.map((u) => {
                if (u.iduser === iduser) {
                    u.new = 0;
                    u.messages = u.messages.map(m => {
                        if (!m.reported) {
                            socket.emit("admin-delivery", {iduser: iduser, idmessage: m.idmessage, status: 'read'})
                            m.reported = true;
                            return m;
                        } else return m;
                    })
                    return u;
                } else return u;
            })
        }))
    }

    const onSubmitMessage = (e) => {
        e.preventDefault();

        let newMessage = {
            iduser: currentUser,
            idadmins: user.idadmins,
            type: 'sent',
            idmessage: uuid(),
            message: message,
            timestamp: Date.now()
        }

        addMessage(newMessage);

        socket.emit("admin-send", newMessage);
        setMessage('');
    }

    if (alreadyConnected) {
        return (
            <div className="row justify-content-center text-muted">
                <div className="col-lg-8 col-md-10 col-sm-12 py-2">
                    <h2>Live Chat: Duplicate window</h2>
                    <p>You have another active chat in another tab, window or browser. Please close this tab.</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="row">
                <div className="col-12 py-3 my-1 text-center text-muted">
                    <h2>Live Chat</h2>
                    <h5>Current User: <span className="text-capitalize">{user.surname}, {user.forenames}</span></h5>
                </div>
            </div>
            <div className="row">
                <div className="col-md-5 col-lg-4 p-2 m-2 border border-primary rounded">
                    <div>
                        <h2>Your chats</h2>
                        <ul className="list-group">
                            {
                                users.users && users.users.length > 0 ?
                                    users.users.map((u) => {
                                        if (u.chatWith === user.idadmins) {
                                            let className = u.selected ? "list-group-item text-capitalize d-flex justify-content-between align-items-center active" : "list-group-item text-capitalize d-flex justify-content-between align-items-center"
                                            return (
                                                <li key={u.iduser} onClick={() => viewChat(u.iduser)} className={className}>
                                                    {u.username}
                                                    <span className="badge bg-primary rounded-pill">{u.new && u.new}</span>
                                                </li>
                                            )
                                        }
                                    })
                                    : <li className="list-group-item">There are no users online.</li>
                            }
                        </ul>
                    </div>
                    <div>
                        <h2>Online/Waiting</h2>
                        <ul className="list-group">
                            {
                                users.users && users.users.length > 0 ?
                                    users.users.map((u) => {
                                        if (u.chatWith === null) {
                                            return (
                                                <li key={u.iduser} onClick={() => selectUser(u.iduser)} className="list-group-item text-capitalize">{u.username}</li>
                                            )
                                        }
                                    })
                                    : <li className="list-group-item">There are no users online.</li>
                            }
                        </ul>
                    </div>
                </div>
                <div className="col-md-6 col-lg-7 border border-primary rounded m-2 p-2">
                    {
                        currentUser && users.users && users.users.map((u) => {
                            if (u.iduser === currentUser) {
                                return (
                                    u.messages && u.messages.map((message) => {
                                        if (u.new) clearNewMessages(u.iduser)
                                        return <Message key={message.idmessage} message={message} />
                                    })
                                )
                            }
                        })
                    }
                    <div>
                        {
                            currentUser ?
                                <form onSubmit={onSubmitMessage}>
                                    <div className="form-group">
                                        <textarea className="form-control" id="message" placeholder="Write message" rows="2" onChange={(e) => setMessage(e.target.value)} value={message}></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary float-right" >Send</button>
                                    <div style={{ clear: 'both' }}></div>
                                </form>
                                :
                                <p className="text-center">No chat selected</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

const Message = ({message}) => {
    if (message.type === 'sent') {
        return (
            <div>
                <div className="float-right text-right mb-1">
                    <p className="border border-primary rounded py-1 px-2 m-0 ml-2">{message.message}</p>
                    <p className="m-0"><small><span className="font-weight-bold">{message.status && message.status}</span>, {moment(message.timestamp).fromNow()}</small></p>
                </div>
                <div style={{clear: 'both'}}></div>
            </div>
        )
    } else {
        return (
            <div>
                <div className="float-left mb-1">
                    <p className="border border-primary rounded py-1 px-2 m-0 mr-2">{message.message}</p>
                    <p className="m-0"><small>{moment(message.timestamp).fromNow()}</small></p>
                </div>
                <div style={{clear: 'both'}}></div>
            </div>
        )
    }
}

export default Chat;
