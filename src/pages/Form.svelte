<script>
    import { TypeAhead } from "slimkit-ui";
    import { validation, Form, formValidity } from "../validator.js";
    import { faUser, faCheck } from "@fortawesome/free-solid-svg-icons";
    import Icon from "fa-svelte";

    // import { sidebarVisible } from "../tores/sidebar-store";
    // import('slimkit-ui/TypeAhead').then(module => {const cmp = module.default})

    // Form variables
    let formData = {
        title: {
            value: "abcd",
            validation: { minLength: 3, maxLength: 5 },
            validationMessage: "Value must be between 3 and 5",
        },
        username: { value: "th", validation: { maxLength: 2 } },
        email: { value: "me@gmail.com", validation: {minLength: 1, 'email':''} },
    };

    const sampleForm = new Form("form-sample", formData);

    export let onToggle;
    export let enableSb;

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

    function enableSidebar() {
        enableSb();
    }

    const link = (node, bar) => {
        console.log("wooooooooooot: " + node.pathname);
        node.pathname = "/fe" + node.pathname;
        console.log(node);
        console.log(node.pathname);

        return {
            destroy() {
                // the node has been removed from the DOM
                console.log("goone: " + bar);
            },
        };
    };

    const submitHandler = () => {
        console.log("****************");
        console.log(sampleForm);
        console.log(sampleForm.isValid());
        console.log(sampleForm.title.value);
        console.log(sampleForm.username.value);
        console.log(sampleForm.email.value);
    };
</script>

<style>
    .top-down-form {
        max-width: 300px;
    }
</style>

<div class="column" id="content">
    <!-- <a href="/about" use:link={"val"}>About!!!!!!</a> -->

    <form on:submit|preventDefault={submitHandler} autocomplete="off">
        <div class="top-down-form">
            <div class="field">
                <label class="label" for="title">Title</label>
                <div class="control">
                    <input
                        id="title"
                        class="input is-large"
                        type="text"
                        use:validation={sampleForm.title}
                        bind:value={sampleForm.title.value}
                        placeholder="Text input" />
                </div>

                {#if sampleForm.title.showError}
                    <p class="help is-danger">This title is invalid</p>
                {/if}

                <div class="field">
                    <label class="label" for="username">Username</label>
                    <div class="control has-icons-left has-icons-right">
                        <input
                            class="input is-success"
                            id="username"
                            type="text"
                            placeholder="Enter user name"
                            use:validation={sampleForm.username}
                            bind:value={sampleForm.username.value} />
                        <span class="icon is-small is-left">
                            <!-- <i class="fas fa-user" /> -->
                            <Icon icon={faUser} />
                        </span>
                        <span class="icon is-small is-right">
                            <!-- <i class="fas fa-check" /> -->
                            <Icon icon={faCheck} />
                        </span>
                    </div>

                    {#if sampleForm.username.showError}
                        <p class="help is-danger">Wrong username!!</p>
                    {/if}
                    
                    <div class="field">
                        <label class="label">Email</label>
                        <div class="control has-icons-left has-icons-right">
                            <input
                            use:validation={sampleForm.email}
                            bind:value={sampleForm.email.value}
                            class="input is-danger"
                            type="email"
                            placeholder="Email input" />
                            <span class="icon is-small is-left">
                                <i class="fas fa-envelope" />
                            </span>
                            <span class="icon is-small is-right">
                                <i class="fas fa-exclamation-triangle" />
                            </span>
                        </div>
                        <p class="help is-danger">This email is invalid</p>
                    </div>
                    
                    {#if sampleForm.email.showError}
                        <p class="help is-danger">Wrong email format!!</p>
                    {/if}

                    <TypeAhead {items} on:selected={onSelect} />
                    <TypeAhead items={simpleItems} on:selected={onSelect} />
                    <!-- <button on:click={changeItems}>Change Items</button> -->
                    <button
                        type="submit"
                        class="is-primary"
                        disabled={!$formValidity[sampleForm.formId].isValid}>Submit</button>
                    <!-- <button type="submit" class="is-primary">Submit {$formValidity[formx.formId].isValid}</button> -->
                </div>
            </div>
        </div>
    </form>
</div>
<button class="button is-primary is-active" on:click={toggle}>Toggle</button>
