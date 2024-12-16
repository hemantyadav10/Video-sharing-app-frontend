import React from 'react'

function SubscriptionIcon({ height = "16", width = "16", fill = '#edeef0' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}><path d="M168-96q-29.7 0-50.85-21.15Q96-138.3 96-168v-384q0-29.7 21.15-50.85Q138.3-624 168-624h624q29.7 0 50.85 21.15Q864-581.7 864-552v384q0 29.7-21.15 50.85Q821.7-96 792-96H168Zm0-72h624v-384H168v384Zm240-36 240-156-240-156v312ZM192-672v-72h576v72H192Zm96-120v-72h384v72H288ZM168-168v-384 384Z" /></svg>
  )
}

export default SubscriptionIcon