const EventBus = new Vue();

const posts = [
   {
    username: 'XZNT',
	caption: "Thru pain",
    userImage: 'https://media-exp1.licdn.com/dms/image/C5603AQGqieqTLlpnRA/profile-displayphoto-shrink_800_800/0/1602576927255?e=1623888000&v=beta&t=JKGj-wg5VseG_SSVUO06UCvxCE8wIhrl8vUjju878xQ',
    postImage: 'https://yruz.ix.tc/upload/photos/2021/04/xXxTB2RB6EOCjzox3q4k_10_93431191a6d34343f5afa1101464d259_image.jpg',
    likes: 0,
    upVoted: false,
    filter: 'perpetua'
   },
  {
    username: 'XZNT',
    userImage: 'https://media-exp1.licdn.com/dms/image/C5603AQGqieqTLlpnRA/profile-displayphoto-shrink_800_800/0/1602576927255?e=1623888000&v=beta&t=JKGj-wg5VseG_SSVUO06UCvxCE8wIhrl8vUjju878xQ',
    postImage: 'https://yruz.ix.tc/upload/photos/2021/04/dEOSYYk5USw1rB4vCS2c_14_0eb2d7c85b5bf2badd1a4ec645f8dda4_avatar_full.png',
    likes: 0,
    upVoted: true,
    caption: 'DLABZ',
    filter: 'lark'
   },
   {
    username: 'XZNT',
    userImage: 'https://media-exp1.licdn.com/dms/image/C5603AQGqieqTLlpnRA/profile-displayphoto-shrink_800_800/0/1602576927255?e=1623888000&v=beta&t=JKGj-wg5VseG_SSVUO06UCvxCE8wIhrl8vUjju878xQ',
    postImage: 'https://yruz.ix.tc/themes/wondertag/img/og.jpg',
    likes: 0,
    upVoted: true,
    caption: 'YRUZ',
    filter: 'clarendon'
   },
  
]

const filters = [
  { name: 'normal' }, { name: 'clarendon' }, { name: 'gingham' }, { name: 'moon' }, { name: 'lark' }, { name: 'reyes' }, { name: 'juno' }, { name: 'slumber' }, { name: 'aden' }, { name: 'perpetua' }, { name: 'mayfair' }, { name: 'rise' }, { name: 'hudson' }, { name: 'valencia' }, { name: 'xpro2' }, { name: 'willow' }, { name: 'lofi' }, { name: 'inkwell' }, { name: 'nashville' }
]

Vue.component('instagram-post', {
  template: 
  `
    <div class="instagram-post">
      <div class="header level">
          <div class="level-left">
            <figure class="image is-32x32">
              <img :src="post.userImage" />
            </figure>
            <span class="username">{{post.username}}</span>
			 
          </div>
		  
      </div>
	  <p class="caption"> {{post.caption}}</p>
      <div class="image-container"
           :class="post.filter"
           :style="{ backgroundImage: 'url(' + post.postImage + ')' }"
           @dblclick="like">
      </div>
	  <div class="dropdown">
  <button onclick="myFunction()" class="dropbtn">  +  </button>
  <div id="myDropdown" class="dropdown-content">
    <p>
            <span>
                <input type="range" min="-50" max="50" value="0" class="supra-rainbow circle" />

            </span>
        </p>
  </div>
</div>
	  
      
    </div>
	<script>
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
</script>
	
  `,
  props: ['post'],
  methods: {
    like() {
      this.post.upVoted ? this.post.likes-- : this.post.likes++;
      this.post.upVoted = !this.post.upVoted;
    }
  }
});

Vue.component('filter-type', {
  template:
  `
   <div class="filter-type">
     <p>{{filter.name}}</p>
    <div class="img"
         :class="filter.name"
         :style="{ backgroundImage: 'url(' + image + ')' }"
         @click="selectFilter">
    </div> 
   </div>
  `,
  props: ['filter', 'image'],
  methods: {
    selectFilter() {
      EventBus.$emit('selectFilter', {filter: this.filter.name});
    }
  }
});

new Vue({
  el: "#app",
  data: {
    posts,
    image: 'https://cdn.dribbble.com/users/46562/screenshots/3802512/attachments/858301/project-zed.jpg',
    caption: '',
    filterType: 'normal',
    step: 1,
    showDetails: false,
    fileInput: ''
  },
  created () {
    EventBus.$on('selectFilter', (evt) => {
      this.filterType = evt.filter;
    })
  },
  methods: {
    fileUpload(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.image = files[0];
      this.createImage();
    },
    createImage() {
      const image = new Image();
      const reader = new FileReader();

      reader.onload = e => {
        this.image = e.target.result;
        this.step = 2;
      };
      reader.readAsDataURL(this.image);
    },
    uploadRandomImage() {
      const randomImages = [
        'https://cdn.dribbble.com/users/46562/screenshots/3802512/attachments/858301/project-zed.jpg',
        'https://c.tadst.com/gfx/750w/turkeysovereigntychildensday.jpg?1',
        
        'https://givemesport.azureedge.net/images/18/01/22/b2f4315e00578c3ac32118d9cb137f8b/960.jpg',
        
        'https://scontent.fcai3-1.fna.fbcdn.net/v/t1.0-9/28467799_415372912250606_2202584948605383306_n.jpg?_nc_cat=0&oh=e7af3d9d495569b79c66564e30d631ee&oe=5B681AEB',
        
        'https://scontent.fcai3-1.fna.fbcdn.net/v/t1.0-9/28279865_414555712332326_491166031417217729_n.jpg?_nc_cat=0&oh=2dcad1b7728a476eb4caa9afe0c6785a&oe=5B63FA61'
      ];
      
      this.image = randomImages[Math.floor(Math.random() * randomImages.length)];
      this.step = 2;
    },
    goToHome() {
      this.image = 'https://scontent.fcai3-1.fna.fbcdn.net/v/t1.0-9/28467799_415372912250606_2202584948605383306_n.jpg?_nc_cat=0&oh=e7af3d9d495569b79c66564e30d631ee&oe=5B681AEB';
      this.caption = '';
      this.filterType = 'normal';
      this.step = 1;
    },
    sharePost() {
      const post = {
        username: 'XZNT',
        userImage: 'https://yruz.ix.tc/upload/photos/2021/04/Khnm6XnkwLIgLsAIM7X3_09_6e2eb4ce8355a0f553e26378146455f3_avatar_full.jpg',
        postImage: this.image,
        likes: 0,
        caption: this.caption,
        filter: this.filterType
      }
      
      this.posts.unshift(post);
      this.goToHome();
    }
  }
});