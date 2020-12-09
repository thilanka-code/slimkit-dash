<script>
    import { TypeAhead } from "sv-lib";
    // import { sidebarVisible } from "../tores/sidebar-store";

    export let onToggle;

    let _items = [
		{ text: "Paaaan1", value: "p1" },
		{ text: "Paaaan2", value: "p12" },
		{ text: "Paaaan3", value: "p3" },
		{ text: "Paaaan4", value: "p14" },
    ];

    let simpleItems = _items;

	let items = new Promise((resolve, reject) => {
		setTimeout(() => resolve(_items), 5000);
	});
    
    function onSelect(v) {
		console.log(v.detail);
	}

	function toggle() {
        // mySideBar.toggleShow();
        // sidebarVisible.update(b => !b);
        // window.toggleSidebar();
        onToggle();
	}

</script>

<style>
    .top-down-form {
		max-width: 300px;
	}
</style>

<div class="column" id="content">
    <!-- <a href="/about">About!!!!!!</a> -->
    <!-- <button class="button" on:click={toggle}>Toggle</button> -->
    <div class="top-down-form">
        <div class="field">
            <label class="label" for="name">Name</label>
            <div class="control">
                <input
                    id="name"
                    class="input is-large"
                    type="text"
                    placeholder="Text input" />
            </div>
        </div>

        <div class="field">
            <label class="label">Username</label>
            <div class="control has-icons-left has-icons-right">
                <input
                    class="input is-success"
                    type="text"
                    placeholder="Text input"
                    value="bulma" />
                <span class="icon is-small is-left">
                    <i class="fas fa-user" />
                </span>
                <span class="icon is-small is-right">
                    <i class="fas fa-check" />
                </span>
            </div>
            <p class="help is-success">
                This username is available
            </p>
        </div>

        <div class="field">
            <label class="label">Email</label>
            <div class="control has-icons-left has-icons-right">
                <input
                    class="input is-danger"
                    type="email"
                    placeholder="Email input"
                    value="hello@" />
                <span class="icon is-small is-left">
                    <i class="fas fa-envelope" />
                </span>
                <span class="icon is-small is-right">
                    <i class="fas fa-exclamation-triangle" />
                </span>
            </div>
            <p class="help is-danger">This email is invalid</p>
        </div>

        <TypeAhead {items} on:selected={onSelect} />
        <TypeAhead items={simpleItems} on:selected={onSelect} />
        <!-- <button on:click={changeItems}>Change Items</button> -->
    </div>
</div>