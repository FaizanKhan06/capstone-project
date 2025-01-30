let allUrls = {
    1: {
        roleName: "Admin",
        dashboard: "/Admin/Dashboard",
    },
    2: {
        roleName: "User",
        dashboard: "/User/Dashboard",
        communityJoin: "/User/CommunityJoin",
        communityView: "/User/CommunityView",
        makeRequest: "/User/MakeRequest",
        makeContribution: "/User/MakeContribution",
    },
    3: {
        roleName: "CommunityHead",
        dashboard: "/CommunityHead/Dashboard",
        createCommunity: "/CommunityHead/CreateCommunity",
        createRules: "/CommunityHead/CreateRules",
    }
}
export default function getAllUrls(role) {
    return allUrls[role];
}