<template>
    <div class="post-container">
        <div class="bg-primary p-3 text-white text-center h3">상세보기</div>

        <b-carousel
            id="carousel-1"
            v-model="slide"
            :interval="4000"
            controls
            indicators
            background="#ababab"
            img-width="1024"
            img-height="480"
            style="text-shadow: 1px 1px 2px #333;"
            @sliding-start="onSlideStart"
            @sliding-end="onSlideEnd"
            >

            <!-- Slides with img slot -->
            <!-- Note the classes .d-block and .img-fluid to prevent browser default image alignment -->
            <b-carousel-slide v-for="image in images" :key="image.id">
                <template v-slot:img>
                <img
                    class="d-block img-fluid w-100"
                    width="1024"
                    height="480"
                    :src="image.image"
                    alt="image slot"
                >
                </template>
            </b-carousel-slide>
        </b-carousel>

        
        <div class="mt-5">
            <div slot="posting">
                <div class="h1 text-center p-3 border-bottom">"{{title}}"</div>
                <div class="h5 text-center p-3">{{content}}</div>
            </div>
        </div>

        <div class="mt-5">
            <div slot="posting">
                <div class="text-center border-bottom border-top p-3 mt-5">옵션</div>
                <div class="d-flex align-items-center justify-content-center" style="height:50px;">
                    <div v-for="option in options" :key="option.id" style="flex:1" class="text-center">{{option.item}}</div>
                </div>
            </div>
        </div>

        <div class="mt-5">
            <div slot="posting">
                <div class="text-center border-bottom border-top p-3 mt-5">위치 정보</div>
                <div class="d-flex" style="height:300px;">
                    <div class="h-100 flex-container" style="flex:1">
                    주소
                    </div>
                    <div class="h-100 flex-container border-left" style="flex:10">
                    <div class="d-flex w-100 align-items-center justify-content-center">
                        {{address}}
                    </div>
                    </div>
                    <div
                    ref="map"
                    class="h-100 flex-container border-left"
                    style="flex:5"
                    >
                    지도
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { postApi } from '../utils/axios';
export default {
    data() {
        return {
            latitude: "",
            longitude: "",
            address: "",
            options: [],
            title: "",
            content: "",
            images: []
        };
    },
    async mounted() {
        try {
            const {id} = this.$route.params;
            console.log(id);
            const {data} = await postApi.getDetail(id);
            console.log(data);
            this.latitude = data.room.latitude;
            this.longitude = data.room.longitude;
            this.address = data.room.address;
            this.options = data.room.Options;
            this.title = data.room.title;
            this.content = data.room.content;

            for (const li of data.room.Images) {
                console.log(li.src);
                const res = await postApi.getFile(li.src);
                const blob = new Blob([res.data], {
                    type: res.headers["content-type"]
                });
                this.images.push({...li, image:window.URL.createObjectURL(blob)});
            }
            console.log(this.images);
            
            const addressScript = document.createElement("script");
            addressScript.src =
            "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
            document.head.appendChild(addressScript);
            const mapScript = document.createElement("script");
            mapScript.onload = () => kakao.maps.load();
            mapScript.src =
            "http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=0fe1d5fd101ab6d2078168510cdb7237&libraries=services";
            document.head.appendChild(mapScript);

            let mapOption = {
                center: new daum.maps.LatLng(this.latitude, this.longitude), //중심좌표
                level: 6, //지도의 확대 레벨
            };
            const mapContainer = this.$refs.map;
            const map = new daum.maps.Map(mapContainer, mapOption);
            
            let coords = new daum.maps.LatLng(this.latitude, this.longitude);
            let marker = new daum.maps.Marker({
                position: coords,
                map: map,
            });
            marker.setMap(map);
        } catch (error) {
            console.log(error);
        }
    }
}
</script>

<style>

</style>