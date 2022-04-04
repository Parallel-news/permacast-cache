# permacast-cache
cache node for [permacast.net](https://permacast.net)

## Supported Endpoints

### 1- Permacast Podcasts Object:
Request: GET `/feeds/podcasts`

Return: Array of podcast objects

```javascript
{
  res: [{}, {}, {}];
}
```

### 2- Podcast's Episodes
Request: GET `/feeds/episodes/:pid`

Return: Single podcast objects

#### Example:

GET `/feeds/episodes/4vTYMVWWxZaU2n2OI4cC-EgC86GcOnz-CaVW7iUwPK4`

```json
{
  "pid": "4vTYMVWWxZaU2n2OI4cC-EgC86GcOnz-CaVW7iUwPK4",
  "index": 0,
  "childOf": "cO1rSCN3RpQUYwzl4j9sr881wdlqDD7FsrJHjYbAztQ",
  "owner": "kaYP9bJtpqON8Kyy3RbqnqdtDBDUsPTQTNUCvZtKiFI",
  "podcastName": "Arweavers AMAs",
  "author": "Arweavers",
  "email": "xylophonezygote@gmail.com",
  "description": "Community AMAs with the permaweb's best minds",
  "language": "en",
  "explicit": "yes",
  "categories": ["Technology"],
  "cover": "ICxI0rStF7Gwmrtp30LLE23-dU9zTh883YxEozWwC3Q",
  "episodes": [
    {
      "eid": "3PmqVp1BLRrR8a604v9JVqedrUdzdUEauJD707COA0A",
      "childOf": 0,
      "episodeName": "#1: ArDrive",
      "description": "Phil and Anthony from the ArDrive team field questions from the Arweavers community.",
      "audioTx": "9CSEFW4O675-wQ9NynqHcuHb-PsCsDKMpxAJ8G62JtU",
      "audioTxByteSize": 69814101,
      "type": "audio/mpeg",
      "uploadedAt": 1636448064,
      "logs": ["3PmqVp1BLRrR8a604v9JVqedrUdzdUEauJD707COA0A"]
    },
    {
      "eid": "cxn6wu-fBtItjruUdf-QpEHarJMrNX0_zSDacUA-hSo",
      "childOf": 0,
      "episodeName": "#2: RedStone",
      "description": "Marcin, head of growth at redstone.finance, speaks about the foundations and future of this Arweave-based oracle.",
      "audioTx": "kmmzsGUj7Qp94DHs1dz-GiPxB85QL7pnsFAylVdeAZU",
      "audioTxByteSize": 60710661,
      "type": "audio/mpeg",
      "uploadedAt": 1636448265,
      "logs": ["cxn6wu-fBtItjruUdf-QpEHarJMrNX0_zSDacUA-hSo"]
    },
    {
      "eid": "nF8wRQ0CsFm8532r_96zBuxrOLR3dxUAxNvqlbWGEmU",
      "childOf": 0,
      "episodeName": "#3: Koii",
      "description": "Al from Koii takes the Arweavers hot seat to discuss the attention economy.",
      "audioTx": "bJt34SSGDUEldfW1xgIJfLtJSVICIEkRJblyph113nw",
      "audioTxByteSize": 48079437,
      "type": "audio/mpeg",
      "uploadedAt": 1636448821,
      "logs": ["nF8wRQ0CsFm8532r_96zBuxrOLR3dxUAxNvqlbWGEmU"]
    },
    {
      "eid": "RKK7MYLLO2OF5Y_wM6L6SV_B7Y7KLzlSYwohgTyzQMQ",
      "childOf": 0,
      "episodeName": "#4: ArGo",
      "description": "Prashant from ArGo chats with the Arweavers community about building an easy-to-use app deployment engine on Arweave.",
      "audioTx": "00LIwQ-D94Vcb96PZl2ZUgaqSCFtf2WlLe34UllY-qA",
      "audioTxByteSize": 30471597,
      "type": "audio/mpeg",
      "uploadedAt": 1636449433,
      "logs": ["RKK7MYLLO2OF5Y_wM6L6SV_B7Y7KLzlSYwohgTyzQMQ"]
    },
    {
      "eid": "axJZdQrG65Uc5keO4xjwIBq5Xo5Pl2C-Mf1rc1j33Dc",
      "childOf": 0,
      "episodeName": "#5: Sarcophagus",
      "description": "Jonny and Zach from Sarcophagus field questions from the Arweavers community around the future of the decentralized dead man's switch.",
      "audioTx": "HV7U1lz4_VcjPmE7tWGLz0VHLsFhGtYK8ge7AL3JPcw",
      "audioTxByteSize": 35406381,
      "type": "audio/mpeg",
      "uploadedAt": 1636449733,
      "logs": ["axJZdQrG65Uc5keO4xjwIBq5Xo5Pl2C-Mf1rc1j33Dc"]
    },
    {
      "eid": "8mVg1wTZqFR4wt3j8NJPni3AA7x2isuqMMnFWTIPPyk",
      "childOf": 0,
      "episodeName": "SevenX Ventures",
      "description": "Founding Partner of SevenX Ventures, Eraser Li, takes questions about Arweave investment from the community.",
      "audioTx": "4s9ZTLsgyzWfx6CTJ-XG_Fbv2S-_7m7RygDI69lqy1c",
      "audioTxByteSize": 32342253,
      "type": "audio/mpeg",
      "uploadedAt": 1638460793,
      "logs": ["8mVg1wTZqFR4wt3j8NJPni3AA7x2isuqMMnFWTIPPyk"]
    }
  ]
}

```

### 3- Podcast's RSS Feed
Request: GET `/feeds/rss/:pid`

Return: Podcast's RSS as XML

#### Example:

GET `/feeds/rss/4vTYMVWWxZaU2n2OI4cC-EgC86GcOnz-CaVW7iUwPK4`

```xml
<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
<script/>
<channel>
<title>
<![CDATA[ Arweavers AMAs ]]>
</title>
<description>
<![CDATA[ Community AMAs with the permaweb's best minds ]]>
</description>
<link>https://permacast.net/#/podcasts/4vTYMVWWxZaU2n2OI4cC-EgC86GcOnz-CaVW7iUwPK4</link>
<image>
<url>https://arweave.net/ICxI0rStF7Gwmrtp30LLE23-dU9zTh883YxEozWwC3Q</url>
<title>Arweavers AMAs</title>
<link>https://permacast.net/#/podcasts/4vTYMVWWxZaU2n2OI4cC-EgC86GcOnz-CaVW7iUwPK4</link>
</image>
<generator>RSS for Node</generator>
<lastBuildDate>Sat, 11 Dec 2021 20:18:19 GMT</lastBuildDate>
<language>
<![CDATA[ en ]]>
</language>
<managingEditor>
<![CDATA[ xylophonezygote@gmail.com ]]>
</managingEditor>
<category>
<![CDATA[ Technology ]]>
</category>
<itunes:image href="https://arweave.net/ICxI0rStF7Gwmrtp30LLE23-dU9zTh883YxEozWwC3Q"/>
<itunes:explicit>yes</itunes:explicit>
<itunes:author>Arweavers</itunes:author>
<itunes:owner>
<itunes:email>xylophonezygote@gmail.com</itunes:email>
<itunes:name>Arweavers AMAs</itunes:name>
</itunes:owner>
<item>
<title>
<![CDATA[ #1: ArDrive ]]>
</title>
<description>
<![CDATA[ Phil and Anthony from the ArDrive team field questions from the Arweavers community. ]]>
</description>
<guid isPermaLink="false">3PmqVp1BLRrR8a604v9JVqedrUdzdUEauJD707COA0A</guid>
<pubDate>Tue, 09 Nov 2021 08:54:24 GMT</pubDate>
<enclosure url="https://arweave.net/9CSEFW4O675-wQ9NynqHcuHb-PsCsDKMpxAJ8G62JtU" length="69814101" type="audio/mpeg"/>
</item>
<item>
<title>
<![CDATA[ #2: RedStone ]]>
</title>
<description>
<![CDATA[ Marcin, head of growth at redstone.finance, speaks about the foundations and future of this Arweave-based oracle. ]]>
</description>
<guid isPermaLink="false">cxn6wu-fBtItjruUdf-QpEHarJMrNX0_zSDacUA-hSo</guid>
<pubDate>Tue, 09 Nov 2021 08:57:45 GMT</pubDate>
<enclosure url="https://arweave.net/kmmzsGUj7Qp94DHs1dz-GiPxB85QL7pnsFAylVdeAZU" length="60710661" type="audio/mpeg"/>
</item>
<item>
<title>
<![CDATA[ #3: Koii ]]>
</title>
<description>
<![CDATA[ Al from Koii takes the Arweavers hot seat to discuss the attention economy. ]]>
</description>
<guid isPermaLink="false">nF8wRQ0CsFm8532r_96zBuxrOLR3dxUAxNvqlbWGEmU</guid>
<pubDate>Tue, 09 Nov 2021 09:07:01 GMT</pubDate>
<enclosure url="https://arweave.net/bJt34SSGDUEldfW1xgIJfLtJSVICIEkRJblyph113nw" length="48079437" type="audio/mpeg"/>
</item>
<item>
<title>
<![CDATA[ #4: ArGo ]]>
</title>
<description>
<![CDATA[ Prashant from ArGo chats with the Arweavers community about building an easy-to-use app deployment engine on Arweave. ]]>
</description>
<guid isPermaLink="false">RKK7MYLLO2OF5Y_wM6L6SV_B7Y7KLzlSYwohgTyzQMQ</guid>
<pubDate>Tue, 09 Nov 2021 09:17:13 GMT</pubDate>
<enclosure url="https://arweave.net/00LIwQ-D94Vcb96PZl2ZUgaqSCFtf2WlLe34UllY-qA" length="30471597" type="audio/mpeg"/>
</item>
<item>
<title>
<![CDATA[ #5: Sarcophagus ]]>
</title>
<description>
<![CDATA[ Jonny and Zach from Sarcophagus field questions from the Arweavers community around the future of the decentralized dead man's switch. ]]>
</description>
<guid isPermaLink="false">axJZdQrG65Uc5keO4xjwIBq5Xo5Pl2C-Mf1rc1j33Dc</guid>
<pubDate>Tue, 09 Nov 2021 09:22:13 GMT</pubDate>
<enclosure url="https://arweave.net/HV7U1lz4_VcjPmE7tWGLz0VHLsFhGtYK8ge7AL3JPcw" length="35406381" type="audio/mpeg"/>
</item>
<item>
<title>
<![CDATA[ SevenX Ventures ]]>
</title>
<description>
<![CDATA[ Founding Partner of SevenX Ventures, Eraser Li, takes questions about Arweave investment from the community. ]]>
</description>
<guid isPermaLink="false">8mVg1wTZqFR4wt3j8NJPni3AA7x2isuqMMnFWTIPPyk</guid>
<pubDate>Thu, 02 Dec 2021 15:59:53 GMT</pubDate>
<enclosure url="https://arweave.net/4s9ZTLsgyzWfx6CTJ-XG_Fbv2S-_7m7RygDI69lqy1c" length="32342253" type="audio/mpeg"/>
</item>
</channel>
</rss>
```

### 4- Permacast Size

Request: GET `/size/permacast`

Return: total episodes size in GiB

### 5- Embed Episode

Request: GET `/embed/:eid`

Return: episode audio player fits for iframe embedding

### 6- Sort feeds

- GET `/feeds/podcasts/sort/episodescount` -> sort podcasts by the episodes count
- GET `/feeds/podcasts/sort/podcastsactivity` -> sort podcasts by latest activity

### 7- Get All Episodes

- GET `/feeds/allcontent` -> return a sorted feed of episodes objects.

### 8- Get Network Stats
Request: GET `/feeds/stats` 

Response example: 
```json
{"total_byte_size":14627915958,"total_episodes_count":400}
```
## License
This project is licensed under the [MIT license](./LICENSE)
