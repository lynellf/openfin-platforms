import React, { useEffect, useState } from 'react'

async function getPlatform(platform, setPlatform) {
    if (!platform) {
        await window.fin.Platform.Layout.init()
        const platform = await window.fin.Platform?.getCurrent()
        setPlatform(platform)
    }
}

async function getClient(platform, setClient) {
    const client = (await platform.getClient()) ?? null
    setClient(client)
}

async function getViews(setViews) {
    console.log('getting views')
    const views = (await window.fin.me.getCurrentViews()) ?? []
    console.log({ views })
    setViews(views)
}

async function getIdentity(identity, setIdentity) {
    if (!identity) {
        let windowIdentity
        if (window.fin.me.isWindow) {
            windowIdentity = window.fin.me.identity
        } else if (window.fin.me.isView) {
            windowIdentity = (await window.fin.me.getCurrentWindow()).identity
        } else {
            throw new Error('Not running in a platform View or Window')
        }

        setIdentity(windowIdentity)
    }
}

function getHandler() {
    return (view) => {
        view.focus()
        view.show()
    }
}

function App() {
    const [identity, setIdentity] = useState(null)
    const [platform, setPlatform] = useState(null)
    const [client, setClient] = useState(null)
    const [layout, setLayout] = useState(null)
    const [views, setViews] = useState([])
    const handleChange = getHandler()
    useEffect(() => {
        getIdentity(identity, setIdentity)
        getPlatform(platform, setPlatform)

        if (identity) {
            if (platform) {
                if (!layout) {
                    const layout = window.fin.Platform.Layout.wrapSync(identity)
                    setLayout(layout)
                }
                if (!client) {
                    getClient(platform, setClient)
                }
            }
        }

        if (views.length === 0) {
            getViews(setViews)
        }
    }, [
        identity,
        platform,
        client,
        layout,
        setLayout,
        views,
        setIdentity,
        setPlatform,
        setClient,
        setViews,
    ])
    console.log({ platform, client, views, identity, layout })
    return (
        <div>
            <style>
                {`
                      .navbar {
                          list-style: none;
                          padding-left: 0;
                          display: flex;
                          justifyContent: space-evenly;
                      }

                      .nav-item {
                          display: block;
                          flex: 1;
                          text-align: center;
                      }

                      .nav-item:hover {
                          cursor: pointer;
                      }

                      .lm_tabs {
                          display: none;
                      }
                    `}
            </style>
            <ul className="navbar">
                {views
                    ? views.map((view) => (
                          <li
                              className="nav-item"
                              key={view.identity.name}
                              onClick={() => handleChange(view)}
                          >
                              {view.identity.name}
                          </li>
                      ))
                    : null}
            </ul>
            <div id="of-frame-main">
                <div id="body-container">
                    <div id="layout-container"></div>
                </div>
            </div>
        </div>
    )
}

export default App
