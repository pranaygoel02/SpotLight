import { MdFacebook, MdWhatsapp } from "react-icons/md";
import { RiFacebookFill, RiTwitterFill, RiWhatsappFill } from "react-icons/ri";

export const shareLinks = [
    // {
    //     title: 'Whatsapp',
    //     icon: <RiWhatsappFill/>,
    //     share: function(url,title) {
    //         let link = `https://api.whatsapp.com/send?text=${title} ${url}` 
    //         return link;
    //     },
    //     color: 'from-green-500 to-green-600'
    // },
    // {
    //     title: 'Facebook',
    //     icon: <RiFacebookFill/>,
    //     share: function(url) {
    //         let link = `https://www.facebook.com/sharer.php?u=${url}`
    //         return link;
    //     },
    //     color: 'from-blue-500 to-blue-600'
    // },
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