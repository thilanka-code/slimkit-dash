<script>
	import { SideBar } from "slimkit-ui";
	
	import Icon from "fa-svelte";
	import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
	import router from "page";
	import { onMount } from "svelte";
	import { menu } from "./sidebar-data.js";
	
	// import Form from './pages/Form.svelte';

	let mySideBar;
	let page;
	let pageParams;
	let isSideBarCollapsed = true;
	let activeIndex =0;
	const BASE_PATH = "__BASE_PATH__" //This will be replaced by rollup replace plugin
	let currentPath = "/";

		
	const routeHandler = (ctx, next) =>{
		// console.log(ctx);
		console.log('Navigatng to : '+ctx.page.current);
		currentPath = ctx.page.current
		pageParams = null;
		console.log(mySideBar);
		next();
	}
		
		
	onMount(()=>{
		router.base(BASE_PATH);

		router('*', routeHandler);

		router("/", () => {
			
			import('./pages/Form.svelte').then(module => {page = module.default});
			// page = Form;
			console.log('page is');
			console.log(page);
			
			pageParams = {onToggle: mySideBar.toggleShow}
					
		});

		router("/about", () => {
			
			import('./pages/About.svelte').then(module => {page = module.default});
			console.log('page is');
			console.log(page);
			
			pageParams = {};
		});

		router.start();
		console.log('router started');
		
	})

	function sidebarCollapsed(evt) {
		isSideBarCollapsed = evt.detail;
	}

	function activeLink(event) {
		console.log('active link= '+event.detail);
		console.log('parent current path: '+currentPath);
		
		router(event.detail);
	}

	function setMenuIndex() {
		activeIndex += 1;
		activeIndex = activeIndex >= Object.keys(menu).length ? 0:activeIndex;
	}

	

</script>

<style lang="scss" global>
	@import "../node_modules/bulma/bulma.sass";

	nav {
		.navbar-brand {
			.navbar-item {
				img {
					max-height: 100px;
				}
			}
		}
	}

	nav.breadcrumb {
		box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
		transition: width ease-in-out 0.75s, height 2s ease-in-out 3s;
		width: 100%;
		height: auto;
	}

	@media screen and (max-width: 900px) {
		nav.breadcrumb {
			height: 0;
			// max-height: 0;
			width: 0;
		}
	}

	.spa-view {
		margin: 10px 30px;
	}

</style>

<main>

	<!-- Nav Bar -->
	<nav class="navbar testx is-primaryx" role="navigation" aria-label="main navigation">
		<div class="navbar-brand">
			<span class="navbar-item">
				<img
				src="framework/img/zircon.png"
				alt="branding"
				width="64"
				height="100" />
			</span>
			{#if isSideBarCollapsed}
		<a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" on:click={mySideBar.toggleShow}>
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
		</a>
		{/if}
			<!-- <Icon icon={faCaretRight} /> -->
		</div>
	</nav>


	<!-- Breadcrum bar -->
	<nav class="breadcrumb is-primary is-right" role="navigation" aria-label="breadcrumbs">
		<ul>
		<li><a href="#" on:click={setMenuIndex}>Current: {currentPath}</a></li>
		  <li><a href="#">Documentation</a></li>
		  <li><a href="#">Components</a></li>
		  <li class="is-active"><a href="#" aria-current="page">Breadcrumb</a></li>
		</ul>
	  </nav>
	<!-- </div> -->



	<div class="columns is-marginlessee">

		<!-- Sidebar -->
		<SideBar {menu} cssClass="column" bind:this={mySideBar} on:collapsed={sidebarCollapsed} 
		{activeIndex} on:click={activeLink} {currentPath}/>
	

			 <!-- SPA View -->
		<div class="columns spa-view">
		<svelte:component this={page} {...pageParams}/>
		</div>

	</div>
</main>
