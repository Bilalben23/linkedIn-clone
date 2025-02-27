export const REACTIONS_ARRAY = [
    {
        name: "like",
        icon: "/assets/icons/like.svg",
        color: "#0A66C2"
    },
    {
        name: "celebrate",
        icon: "/assets/icons/celebrate.svg",
        color: "#44712E"
    },
    {
        name: "support",
        icon: "/assets/icons/support.svg",
        color: "#715E86"
    },
    {
        name: "love",
        icon: "/assets/icons/love.svg",
        color: "#B24020"
    },
    {
        name: "insightful",
        icon: "/assets/icons/insightful.svg",
        color: "#915907"
    },
    {
        name: "funny",
        icon: "/assets/icons/funny.svg",
        color: "#1A707E"
    }
];

export const REACTIONS_OBJECT = REACTIONS_ARRAY.reduce((acc, reaction) => {
    acc[reaction.name] = reaction;
    return acc;
}, {});
