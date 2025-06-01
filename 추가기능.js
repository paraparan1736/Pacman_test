/*encodeURLComponent는 단순 shareUrl이 아닌 문자열을 공유할 때 사용한다.
한글, 특수문자, 띄어쓰기를 안전하게 넣기 위함.*/
Kakao.init('02d767994e4950ab114213aff2a1c777');

function snsShare(sns) {
    let maxScore = 123; //쿠키 먹은 점수
    let shareUrl;
    const text = `내 점수는 ${maxScore}점이에요!\nhttps://example.com << 팩맨 게임하러가기\n#Pacman`;
    switch(sns){
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
            window.open(shareUrl, "_blank"); //Url 열어라, 새탭으로(_blank)
            break;

        case 'facebook':
            const shareLinkFacebook = 'https://example.com';
            url = `http://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLinkFacebook)}`;
            window.open(url, "_blank");
            break;

        case 'kakaotalk':
            Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: 'Pacman',
                description: text,
                imageUrl: 'https://placehold.co/600x400',
                link: {
                    webUrl: 'https://example.com', //주소를 따로 못만들면 그냥 카카오톡은 버리는걸로
                    mobileWebUrl: 'https://example.com'
                },
            },
                buttons: [
                    {
                        title: 'Pacman 게임하러가기',
                        link: {
                            webUrl: 'https://example.com',
                            mobileWebUrl: 'https://example.com'
                        },
                    },
                ],
                installTalk: true,
            })
            break;

            default:
                alert("지원하지 않는 SNS입니다.");
    }
}