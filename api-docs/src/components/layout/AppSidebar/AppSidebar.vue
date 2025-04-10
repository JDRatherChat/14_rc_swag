<script setup>
const apiSections = [
  {
    title: 'Getting Started',
    items: ['Introduction', 'Authentication', 'Rate Limiting']
  },
  {
    title: 'Users API',
    items: ['List Users', 'Get User', 'Create User', 'Update User', 'Delete User']
  },
  {
    title: 'Products API',
    items: ['List Products', 'Get Product', 'Create Product', 'Update Product', 'Delete Product']
  }
]
</script>

<template>
  <aside :class="$style.sidebar">
    <div :class="$style.container">
      <div :class="$style.search">
        <input type="text" placeholder="Search API..." :class="$style.searchInput">
      </div>
      <nav :class="$style.nav">
        <div v-for="section in apiSections" :key="section.title" :class="$style.section">
          <h3 :class="$style.sectionTitle">{{ section.title }}</h3>
          <ul :class="$style.sectionList">
            <li v-for="item in section.items" :key="item">
              <a href="#" :class="$style.sectionLink">{{ item }}</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </aside>
</template>

<style lang="scss" module>
@import '../../../assets/styles/index.scss';

.sidebar {
  grid-area: sidebar;
  width: $sidebar-width;
  height: 100%;
  background-color: $background-color;
  border-right: 1px solid $border-color;
  position: fixed;
  top: $header-height;
  left: 0;
  bottom: 0;
  z-index: $z-index-sidebar;
  overflow-y: auto;
}

.container {
  padding: $spacing-md;
}

.search {
  margin-bottom: $spacing-lg;
}

.searchInput {
  width: 100%;
  padding: $spacing-sm;
  border: 1px solid $border-color;
  border-radius: $border-radius-sm;
  font-size: $font-size-sm;

  &:focus {
    outline: none;
    border-color: $primary-color;
    @include focus-ring;
  }
}

.nav {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.section {
  &:not(:last-child) {
    border-bottom: 1px solid $border-color;
    padding-bottom: $spacing-lg;
  }
}

.sectionTitle {
  font-size: $font-size-sm;
  font-weight: 600;
  color: $text-color;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: $spacing-sm;
}

.sectionList {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sectionLink {
  display: block;
  padding: $spacing-sm;
  color: $text-color;
  text-decoration: none;
  border-radius: $border-radius-sm;
  transition: all $transition-fast;

  &:hover {
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
  }
}
</style>
