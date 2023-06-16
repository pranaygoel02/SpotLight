import { RiTwitterFill } from "react-icons/ri";

export const shareLinks = [
    {
        title: 'Twitter',
        icon: <RiTwitterFill/>,
        share: function(url,title) {
            let link = `https://twitter.com/share?url=${url}&text=${title}`
            return link;
        },
        color: 'from-blue-400 to-blue-500'
    },    
]