<script lang="ts">
	import Link from '$layout/Link.svelte';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title="Home"
	description="We are a network of cultdao.io fans promoting freedom, fairness, education and love."
/>

<article class="container">
	<h2 class="text-center">CULT Magazine</h2>
	<section class="text-center">
		<p>The CULT Magazine might inspire people to explore and potentially improve the architecture of freedom.</p><br>
		<!-- <p>
			We are a network of <a href="https://cultdao.io" target="_blank">cultdao.io</a> fans promoting
			freedom,
			<a href="https://github.com/michael-spengler/fairness/blob/main/README.md" target="_blank">
				fairness</a
			>, education, and <a href="https://cultkamasutra.eth.limo/" target="_blank"> love</a>.
		</p><br> -->
		<p>
			Everyone is invited to contribute to this decentralized magazine via <a
				href="https://github.com/michael-spengler/cultmagazine"
				target="_blank">pull request</a
			>.
		</p><br>
		<p>
			Each contribution can be rewarded as an <a
				href="https://revolt.cultdao.io/submitProposal"
				target="_blank">act of revolt</a
			>.
		</p><br>
		<!-- <p>You might be interested in</p><br>
		<p>
			<a href="/cultproposals">CULT Proposals</a><br />
		</p><br>
		<p>
			<a href="/rvltproposals">Revolt 2 Earn</a><br />
		</p><br>
		<p>
			<a href="/news">CULT News</a><br />
		</p><br>
		<p>
			<a href="/events">CULT Events</a><br />
		</p><br>
		<p>
			<a href="/resources">CULT Resources</a><br />
		</p><br>
		<p>
			<a href="/markets">CULT Markets</a><br />
		</p> -->
		<!-- <p>
			<a href="/markets">CULT Chats (coming soon)</a><br />
		</p> -->
	</section>

	<!-- <iframe
		width="100%"
		height="600"
		src="https://www.youtube.com/embed/J7GY1Xg6X20"
		title="YouTube video player"
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		allowfullscreen
	/> -->

	<iframe
		class="rumble"
		width="100%"
		height="600"
		src="https://rumble.com/embed/v1in4yp/?pub=1e5w3p"
		frameborder="0"
		allowfullscreen
		title="Getting Ready"
	/>

	<!-- <script>!function(r,u,m,b,l,e){r._Rumble=b,r[b]||(r[b]=function(){(r[b]._=r[b]._||[]).push(arguments);if(r[b]._.length==1){l=u.createElement(m),e=u.getElementsByTagName(m)[0],l.async=1,l.src="https://rumble.com/embedJS/u1e5w3p"+(arguments[1].video?'.'+arguments[1].video:'')+"/?url="+encodeURIComponent(location.href)+"&args="+encodeURIComponent(JSON.stringify([].slice.apply(arguments))),e.parentNode.insertBefore(l,e)}})}(window, document, "script", "Rumble");</script>
	<div id="rumble_v1in4yp"></div>
	<script>Rumble("play", {"video":"v1in4yp","div":"rumble_v1in4yp"});</script> -->

	<!-- https://rumble.com/v1l9avx-cult.html -->

	<div class="text-center">
		<a href="https://cultdao.io/manifesto.pdf">CULT</a> <br /><br /> is the financial hub of a new,
		free society.
		<p><br /><br /></p>
		<a href="https://cultdao.io/rvlt.pdf">Revolt 2 Earn</a> <br /><br /> is the council & support
		system.
		<p><br /><br /></p>
		<p><br /></p>

		<h3>CULTDAO in 100 Seconds with Michael Saylor</h3>
		<p><br /></p>
		Please talk about CULT after watching this video.
		<p><br /><br /></p>
		<!-- https://rumble.com/v1ldzl9-cultdao-in-100-seconds-michael-saylor-talks-about-cult.html
			
		-->

		<iframe
			class="rumble"
			width="100%"
			height="600"
			src="https://rumble.com/embed/v1isz4j/?pub=1e5w3p"
			frameborder="0"
			allowfullscreen
			title="CULTDAO in 100 seconds with Michael Saylor"
		/>

		<p><br /><br /><br /><br /></p>

		<!-- <h3>Free Internet & Freedom of Speech</h3>
		<p><br /></p>
		The cultmagazine supports free internet & freedom of speech.   <br><br>
		Please retweet the following tweet or share this facebook post? 

		#starlinkiscult 

		<p><br /></p> -->
		<h3>Revolt 2 Earn in 100 Seconds with Michael Saylor</h3>
		<p><br /></p>
		Please 
		<a href="https://uniswap.org/" target="_blank">
			buy the dip 	
		</a>
		and 
		<a href="https://revolt.cultdao.io/submitProposal" target="_blank">
			revolt 2 earn 	
		</a>
		after watching this video.
		<p><br /><br /></p>

		<iframe
			class="rumble"
			width="100%"
			height="600"
			src="https://rumble.com/embed/v1isy13/?pub=1e5w3p"
			frameborder="0"
			allowfullscreen
			title="CULTDAO in 100 seconds with Michael Saylor"
		/>
		<p><br /><br /><br /><br /></p>
		<h3>Join Us We Rock</h3>
	</div>

	<section id="communitylinks">
		<ul>
			<Link path="https://discord.gg/wearecultdao">
				<img src="images/discord.svg" alt="" />
				Discord
			</Link>
			<Link path="https://rumble.com/c/c-1902267">
				<img src="images/youtube.svg" alt="" />
				YouTube
			</Link>
			<Link path="https://twitter.com/MrOmodulus">
				<img src="images/twitter.svg" alt="" />
				Twitter
			</Link>
		</ul>
		<ul>
			<Link path="https://doc.cultdao.io/">
				<img src="images/newsletter.svg" alt="" />
				Newsletter
			</Link>
			<Link path="https://www.reddit.com/r/cultdao/">
				<img src="images/reddit.svg" alt="" />
				Reddit
			</Link>
			<Link path="https://www.cultradio.com/">
				<img src="images/radio.svg" alt="" />
				Podcast
			</Link>
		</ul>
	</section>

	<div class="text-center">
		<section id="rumble">
			<p><br></p>
			<h3>We Support rumble.com</h3>
			<br>
			Please copy your videos from youtube to rumble. We support rumble via IPFS backups.
			<p><br><br></p>
			<iframe
				class="rumble"
				width="100%"
				height="600"
				src="https://rumble.com/embed/v1im0wr/?pub=1e5w3p"
				frameborder="0"
				allowfullscreen
				title="CULTDAO in 100 seconds with Michael Saylor"
			/>
		</section>
	</div>

	<section id="stateofthegame">
		<div class="text-center">
			<h3>State of the Game in September 2022</h3>
			<p><br /></p>

			During the upcoming winter, politicians want you hungry, cold and full of fear so that they
			can offer you things like Central Bank Digital Currencies (CBDCs)... with which they want to
			expand their power and take away your rights and freedom.<br /><br />
			<img
				src="https://raw.githubusercontent.com/cultfamily-on-github/cult-artefacts-collection/main/cult-memes/beat-corrupt-politicians.png"
				alt="truth seekers"
				class="centeredImage"
			/> <br />
			This is why politicians force young people (aka soldiers) to kill the victims of the other propaganda
			mutually. <br /><br />
			This is why politicians want to destroy farmers and food facilities.<br /><br />
			This is why politicians want to keep you stupid.
			<p><br /></p>
			Guess what. Those politicians messed around with the wrong guys.<br /><br /><br />

			<h3>Our Solution Proposal</h3>
			<p><br /></p>

			CULT is the financial hub of a new, free society.<br /><br />
			RVLT is the council & support system.<br /><br />

			We are the A-Team. <br /><br />

			<!-- <iframe width="560" height="315" src="https://www.youtube.com/embed/FPQlXNH36mI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->

			<iframe
				class="rumble"
				width="100%"
				height="600"
				src="https://www.youtube.com/embed/FPQlXNH36mI"
				frameborder="0"
				allowfullscreen
				title="The A-Team Supports"
			/>
			<br>
			
			The power they took from the people will return to the people.
			<!-- <iframe
				class="rumble"
				width="100%"
				height="600"
				src="https://www.youtube.com/watch?v=FPQlXNH36mI"
				frameborder="0"
				allowfullscreen
				title="I love it when a plan comes together"
				/> -->
				<!-- We support decentralization to prepare the ground for a real direct democracy. <br /><br />
					Education is key. Please help us by talking about CULT. <br /><br /><br /> -->
				</div>
			</section>
			
			<div class="text-center">
				<h3>Time For Some Action</h3>
				<p><br /></p>
				Let's get ready for the party.

				<p><br></p>
				<iframe
					class="rumble"
					width="100%"
					height="600"
					src="https://www.youtube.com/embed/fW8amMCVAJQ"
					frameborder="0"
					allowfullscreen
					title="The A-Team Supports Rumble"
				/>

				<p><br><br></p>
				
				<ol>
					<li>1. Share this page with your friends</li>
					<br />
					<li>
						2. Join <a href="https://discord.com/invite/wearecultdao" target="_blank"> our community</a>
						to educate yourself and others
					</li>
					<br />
					<li>
						3. Install <a href="https://metamask.io" target="_blank"> metamask.io </a> 
						or another browserwallet you fully trust
					</li>
					<br />
					<li>
						4. Add CULT asset --> custom token in metamask via smart contract address
						0xf0f9d895aca5c8678f706fb8216fa22957685a13
					</li>
					<br />
					<li>
						5. Buy (the dip) CULT on
						<a href="https://uniswap.org" target="_blank"> uniswap.org </a>
					</li>
					<br />
					<li>6. Bookmark the fancy page which you are currently on</li><br>
					<li>7. Let us learn 
						<a href="https://www.youtube.com/watch?v=09maaUaRT4M" target="_blank"> from that</a> 
						and heal
						
					</li>
					
					
				</ol>

				<!-- <iframe width="560" height="315" src="https://www.youtube.com/embed/fW8amMCVAJQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->

			
				
				<!-- not adding the following yet because we might care about cookie stuff beforehand -->
				<!-- <iframe width="420" height="315" src="https://www.youtube.com/watch?v=fW8amMCVAJQ&t=2s" /> -->


				<!-- <p><br><br></p>
				<h3>Further Education</h3>
				<p><br></p>
				As soon as you followed the steps from above you might also watch the following video. <br><br>
				The cultmagazine is a decentralized magazine and you are invited 
				<a href="https://github.com/michael-spengler/cultmagazine" target="_blank"> to contribute</a> . 

				<p><br></p>

				<iframe
				class="rumble"
				width="100%"
				height="600"
				src="https://www.youtube.com/embed/09maaUaRT4M"
				frameborder="0"
				allowfullscreen
				title="The A-Team Supports Rumble"
			/> -->
			</div>
</article>

<style>
	.centeredImage {
		display: block;
		margin-left: auto;
		margin-right: auto;
		width: 50%;
	}
	article {
		max-width: 1024px;
		display: grid;
		gap: var(--s-10);
	}

	section {
		display: flow;
		gap: var(--s-5);
	}
	ul {
		display: flex;
		flex-wrap: wrap;
		column-gap: var(--s-20);
		row-gap: var(--s-5);
		justify-content: space-around;
		text-align: center;
	}
	img {
		width: 128px;
	}

	@media (min-width: 1280px) {
		article {
			gap: var(--s-20);
		}
	}
</style>
