<script>
	import { SideBar } from "sv-lib";
	import Icon from "fa-svelte";
	import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
	import "bulma/css/bulma.min.css";
	import router from "page";
	import About from "./pages/About.svelte";
	import Form from './pages/Form.svelte';
	import { onMount } from "svelte";
	import { menu } from "./sidebar-data.js";
	// import { sidebarClosed } from "./stores/sidebar-store";

	let mySideBar;
	let page;
	let pageParams;
	let isSideBarCollapsed = true;
	let activeIndex =0;
	let currentPath = "/";

	// $: {
		
	// }

	const routeHandler = (ctx, next) =>{
		// console.log(ctx);
		console.log('Navigatng to : '+ctx.page.current);
		currentPath = ctx.page.current
		pageParams = null;
		next();
	}


	onMount(()=>{

		router('*', routeHandler)
		router("/", () => {
			page = Form;
			pageParams = {onToggle: mySideBar.toggleShow}
		});
		router("/about", () => (page = About));

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

	// setInterval(()=>setMenuIndex(),1000)

	

</script>

<style lang="scss">
	nav {
		// background-color: chocolate;
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

	// SideBar {
	// 	margin
	// }

	//  @import "bulma/sass/utilities/_all.sass";
	//  @import "bulma/sass/base/_all.sass";
	//  @import "bulma/sass/components/menu.sass";
	//  @import "bulma/bulma.sass";
	/* main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	} */
</style>

<main>
	<!-- Nav Bar -->
	<nav class="navbar" role="navigation" aria-label="main navigation">
		<div class="navbar-brand">
			<span class="navbar-item">
				<img
				src="/framework/img/zircon.png"
				alt="branding"
				width="64"
				height="100" />
			</span>
			{#if isSideBarCollapsed}
		<a role="button" class="navbar-burger is-activex" aria-label="menu" aria-expanded="false" on:click={mySideBar.toggleShow}>
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
		</a>
		{/if}
			<!-- <Icon icon={faCaretRight} /> -->
		</div>
	</nav>


	<!-- Breadcrum bar -->
	<nav class="breadcrumb is-right" aria-label="breadcrumbs">
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
