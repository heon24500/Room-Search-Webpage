<template>
  <div>
      <div class="bg-primary p-3 text-white text-center h3">방 목록</div>
      <div v-if="lists.length" class="d-flex flex-wrap justify-content-center p-3">
          <div class="border-top shadow ml-3 mt-3 card-wrapper" v-for="list in lists" :key="list.id" @click="moveDetail(list.id)">
              <div v-if="list.image" class="post-image" :style="{backgroundImage: `url(${list.image})`}"></div>
              <div class="text-center">{{list.title}}</div>
              <div class="border-top p-3 text-center">{{list.content}}</div>
          </div>
      </div>
  </div>
</template>

<script>
import { postApi } from '../utils/axios';
export default {
    data() {
        return {
            lists: [],
            imageList: []
        };
    },
    async mounted() {
        console.log(this.$route);
        const {data} = await postApi.getList(this.$route.query.search);
        console.log("data", data);
        // Promise.all과 for of의 차이점: Promise.all은 일괄적으로 요청을 보내서 리턴을 받기 때문에 순서가 보장되지 않는다.
        // for of는 순서가 보장된다.
        for (const li of data.room) {
            if (li.Images.length) {
                const res = await postApi.getFile(li.Images[0].src);
                const blob = new Blob([res.data], {
                    type: res.headers["content-type"]
                });
                console.log(window.URL.createObjectURL(blob));
                this.lists.push({...li, image:window.URL.createObjectURL(blob)});
            }
        }
        console.log("lists", this.lists);
        console.log("imageList", this.imageList);
    },
    methods: {
        moveDetail(id) {
            console.log(id);
            this.$router.push(`detail/${id}`);
        }
    }
}
</script>

<style>
.post-image {
    width: 400px;
    height: 300px;
    background-size: cover;
}
.card-wrapper:hover {
    opacity: 0.5;
    cursor: pointer;
}
</style>