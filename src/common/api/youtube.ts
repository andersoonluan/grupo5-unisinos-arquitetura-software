import axios from 'axios';

const YOUTUBE_BASE = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

type GetVideosResponse = {
  data: any[];
};

async function search (value: string): Promise<any> {
  try {
    const url = `${YOUTUBE_BASE}/search?key=${API_KEY}&type=video&part=snippet&q=${value}`;
    const { data, status } = await axios.get<GetVideosResponse>(
        url,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    console.log(JSON.stringify(data, null, 4));
    console.log('response status is: ', status);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}

export default search;